package com.boostclient.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.boostclient.IntegrationTest;
import com.boostclient.domain.Employer;
import com.boostclient.domain.Quote;
import com.boostclient.repository.QuoteRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link QuoteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class QuoteResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_QUOTE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_QUOTE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/quotes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private QuoteRepository quoteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restQuoteMockMvc;

    private Quote quote;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Quote createEntity(EntityManager em) {
        Quote quote = new Quote().name(DEFAULT_NAME).quoteDate(DEFAULT_QUOTE_DATE);
        // Add required entity
        Employer employer;
        if (TestUtil.findAll(em, Employer.class).isEmpty()) {
            employer = EmployerResourceIT.createEntity(em);
            em.persist(employer);
            em.flush();
        } else {
            employer = TestUtil.findAll(em, Employer.class).get(0);
        }
        quote.setEmployer(employer);
        return quote;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Quote createUpdatedEntity(EntityManager em) {
        Quote quote = new Quote().name(UPDATED_NAME).quoteDate(UPDATED_QUOTE_DATE);
        // Add required entity
        Employer employer;
        if (TestUtil.findAll(em, Employer.class).isEmpty()) {
            employer = EmployerResourceIT.createUpdatedEntity(em);
            em.persist(employer);
            em.flush();
        } else {
            employer = TestUtil.findAll(em, Employer.class).get(0);
        }
        quote.setEmployer(employer);
        return quote;
    }

    @BeforeEach
    public void initTest() {
        quote = createEntity(em);
    }

    @Test
    @Transactional
    void createQuote() throws Exception {
        int databaseSizeBeforeCreate = quoteRepository.findAll().size();
        // Create the Quote
        restQuoteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(quote)))
            .andExpect(status().isCreated());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeCreate + 1);
        Quote testQuote = quoteList.get(quoteList.size() - 1);
        assertThat(testQuote.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testQuote.getQuoteDate()).isEqualTo(DEFAULT_QUOTE_DATE);
    }

    @Test
    @Transactional
    void createQuoteWithExistingId() throws Exception {
        // Create the Quote with an existing ID
        quote.setId(1L);

        int databaseSizeBeforeCreate = quoteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuoteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(quote)))
            .andExpect(status().isBadRequest());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = quoteRepository.findAll().size();
        // set the field null
        quote.setName(null);

        // Create the Quote, which fails.

        restQuoteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(quote)))
            .andExpect(status().isBadRequest());

        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkQuoteDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = quoteRepository.findAll().size();
        // set the field null
        quote.setQuoteDate(null);

        // Create the Quote, which fails.

        restQuoteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(quote)))
            .andExpect(status().isBadRequest());

        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllQuotes() throws Exception {
        // Initialize the database
        quoteRepository.saveAndFlush(quote);

        // Get all the quoteList
        restQuoteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(quote.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].quoteDate").value(hasItem(DEFAULT_QUOTE_DATE.toString())));
    }

    @Test
    @Transactional
    void getQuote() throws Exception {
        // Initialize the database
        quoteRepository.saveAndFlush(quote);

        // Get the quote
        restQuoteMockMvc
            .perform(get(ENTITY_API_URL_ID, quote.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(quote.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.quoteDate").value(DEFAULT_QUOTE_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingQuote() throws Exception {
        // Get the quote
        restQuoteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewQuote() throws Exception {
        // Initialize the database
        quoteRepository.saveAndFlush(quote);

        int databaseSizeBeforeUpdate = quoteRepository.findAll().size();

        // Update the quote
        Quote updatedQuote = quoteRepository.findById(quote.getId()).get();
        // Disconnect from session so that the updates on updatedQuote are not directly saved in db
        em.detach(updatedQuote);
        updatedQuote.name(UPDATED_NAME).quoteDate(UPDATED_QUOTE_DATE);

        restQuoteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedQuote.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedQuote))
            )
            .andExpect(status().isOk());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeUpdate);
        Quote testQuote = quoteList.get(quoteList.size() - 1);
        assertThat(testQuote.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testQuote.getQuoteDate()).isEqualTo(UPDATED_QUOTE_DATE);
    }

    @Test
    @Transactional
    void putNonExistingQuote() throws Exception {
        int databaseSizeBeforeUpdate = quoteRepository.findAll().size();
        quote.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuoteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, quote.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(quote))
            )
            .andExpect(status().isBadRequest());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchQuote() throws Exception {
        int databaseSizeBeforeUpdate = quoteRepository.findAll().size();
        quote.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuoteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(quote))
            )
            .andExpect(status().isBadRequest());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamQuote() throws Exception {
        int databaseSizeBeforeUpdate = quoteRepository.findAll().size();
        quote.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuoteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(quote)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateQuoteWithPatch() throws Exception {
        // Initialize the database
        quoteRepository.saveAndFlush(quote);

        int databaseSizeBeforeUpdate = quoteRepository.findAll().size();

        // Update the quote using partial update
        Quote partialUpdatedQuote = new Quote();
        partialUpdatedQuote.setId(quote.getId());

        restQuoteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuote.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQuote))
            )
            .andExpect(status().isOk());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeUpdate);
        Quote testQuote = quoteList.get(quoteList.size() - 1);
        assertThat(testQuote.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testQuote.getQuoteDate()).isEqualTo(DEFAULT_QUOTE_DATE);
    }

    @Test
    @Transactional
    void fullUpdateQuoteWithPatch() throws Exception {
        // Initialize the database
        quoteRepository.saveAndFlush(quote);

        int databaseSizeBeforeUpdate = quoteRepository.findAll().size();

        // Update the quote using partial update
        Quote partialUpdatedQuote = new Quote();
        partialUpdatedQuote.setId(quote.getId());

        partialUpdatedQuote.name(UPDATED_NAME).quoteDate(UPDATED_QUOTE_DATE);

        restQuoteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedQuote.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedQuote))
            )
            .andExpect(status().isOk());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeUpdate);
        Quote testQuote = quoteList.get(quoteList.size() - 1);
        assertThat(testQuote.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testQuote.getQuoteDate()).isEqualTo(UPDATED_QUOTE_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingQuote() throws Exception {
        int databaseSizeBeforeUpdate = quoteRepository.findAll().size();
        quote.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuoteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, quote.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(quote))
            )
            .andExpect(status().isBadRequest());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchQuote() throws Exception {
        int databaseSizeBeforeUpdate = quoteRepository.findAll().size();
        quote.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuoteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(quote))
            )
            .andExpect(status().isBadRequest());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamQuote() throws Exception {
        int databaseSizeBeforeUpdate = quoteRepository.findAll().size();
        quote.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restQuoteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(quote)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Quote in the database
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteQuote() throws Exception {
        // Initialize the database
        quoteRepository.saveAndFlush(quote);

        int databaseSizeBeforeDelete = quoteRepository.findAll().size();

        // Delete the quote
        restQuoteMockMvc
            .perform(delete(ENTITY_API_URL_ID, quote.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Quote> quoteList = quoteRepository.findAll();
        assertThat(quoteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
