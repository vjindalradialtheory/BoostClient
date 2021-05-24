package com.boostclient.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.boostclient.IntegrationTest;
import com.boostclient.domain.Employer;
import com.boostclient.repository.EmployerRepository;
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
 * Integration tests for the {@link EmployerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EmployerResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/employers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EmployerRepository employerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEmployerMockMvc;

    private Employer employer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Employer createEntity(EntityManager em) {
        Employer employer = new Employer().name(DEFAULT_NAME);
        return employer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Employer createUpdatedEntity(EntityManager em) {
        Employer employer = new Employer().name(UPDATED_NAME);
        return employer;
    }

    @BeforeEach
    public void initTest() {
        employer = createEntity(em);
    }

    @Test
    @Transactional
    void createEmployer() throws Exception {
        int databaseSizeBeforeCreate = employerRepository.findAll().size();
        // Create the Employer
        restEmployerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(employer)))
            .andExpect(status().isCreated());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeCreate + 1);
        Employer testEmployer = employerList.get(employerList.size() - 1);
        assertThat(testEmployer.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createEmployerWithExistingId() throws Exception {
        // Create the Employer with an existing ID
        employer.setId(1L);

        int databaseSizeBeforeCreate = employerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEmployerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(employer)))
            .andExpect(status().isBadRequest());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = employerRepository.findAll().size();
        // set the field null
        employer.setName(null);

        // Create the Employer, which fails.

        restEmployerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(employer)))
            .andExpect(status().isBadRequest());

        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllEmployers() throws Exception {
        // Initialize the database
        employerRepository.saveAndFlush(employer);

        // Get all the employerList
        restEmployerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(employer.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getEmployer() throws Exception {
        // Initialize the database
        employerRepository.saveAndFlush(employer);

        // Get the employer
        restEmployerMockMvc
            .perform(get(ENTITY_API_URL_ID, employer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(employer.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingEmployer() throws Exception {
        // Get the employer
        restEmployerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEmployer() throws Exception {
        // Initialize the database
        employerRepository.saveAndFlush(employer);

        int databaseSizeBeforeUpdate = employerRepository.findAll().size();

        // Update the employer
        Employer updatedEmployer = employerRepository.findById(employer.getId()).get();
        // Disconnect from session so that the updates on updatedEmployer are not directly saved in db
        em.detach(updatedEmployer);
        updatedEmployer.name(UPDATED_NAME);

        restEmployerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEmployer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEmployer))
            )
            .andExpect(status().isOk());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeUpdate);
        Employer testEmployer = employerList.get(employerList.size() - 1);
        assertThat(testEmployer.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingEmployer() throws Exception {
        int databaseSizeBeforeUpdate = employerRepository.findAll().size();
        employer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmployerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, employer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(employer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEmployer() throws Exception {
        int databaseSizeBeforeUpdate = employerRepository.findAll().size();
        employer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(employer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEmployer() throws Exception {
        int databaseSizeBeforeUpdate = employerRepository.findAll().size();
        employer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(employer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEmployerWithPatch() throws Exception {
        // Initialize the database
        employerRepository.saveAndFlush(employer);

        int databaseSizeBeforeUpdate = employerRepository.findAll().size();

        // Update the employer using partial update
        Employer partialUpdatedEmployer = new Employer();
        partialUpdatedEmployer.setId(employer.getId());

        partialUpdatedEmployer.name(UPDATED_NAME);

        restEmployerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmployer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmployer))
            )
            .andExpect(status().isOk());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeUpdate);
        Employer testEmployer = employerList.get(employerList.size() - 1);
        assertThat(testEmployer.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void fullUpdateEmployerWithPatch() throws Exception {
        // Initialize the database
        employerRepository.saveAndFlush(employer);

        int databaseSizeBeforeUpdate = employerRepository.findAll().size();

        // Update the employer using partial update
        Employer partialUpdatedEmployer = new Employer();
        partialUpdatedEmployer.setId(employer.getId());

        partialUpdatedEmployer.name(UPDATED_NAME);

        restEmployerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEmployer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEmployer))
            )
            .andExpect(status().isOk());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeUpdate);
        Employer testEmployer = employerList.get(employerList.size() - 1);
        assertThat(testEmployer.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingEmployer() throws Exception {
        int databaseSizeBeforeUpdate = employerRepository.findAll().size();
        employer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEmployerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, employer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(employer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEmployer() throws Exception {
        int databaseSizeBeforeUpdate = employerRepository.findAll().size();
        employer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(employer))
            )
            .andExpect(status().isBadRequest());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEmployer() throws Exception {
        int databaseSizeBeforeUpdate = employerRepository.findAll().size();
        employer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEmployerMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(employer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Employer in the database
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEmployer() throws Exception {
        // Initialize the database
        employerRepository.saveAndFlush(employer);

        int databaseSizeBeforeDelete = employerRepository.findAll().size();

        // Delete the employer
        restEmployerMockMvc
            .perform(delete(ENTITY_API_URL_ID, employer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Employer> employerList = employerRepository.findAll();
        assertThat(employerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
