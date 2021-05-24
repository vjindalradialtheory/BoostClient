package com.boostclient.web.rest;

import com.boostclient.domain.Quote;
import com.boostclient.repository.QuoteRepository;
import com.boostclient.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.boostclient.domain.Quote}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class QuoteResource {

    private final Logger log = LoggerFactory.getLogger(QuoteResource.class);

    private static final String ENTITY_NAME = "quote";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuoteRepository quoteRepository;

    public QuoteResource(QuoteRepository quoteRepository) {
        this.quoteRepository = quoteRepository;
    }

    /**
     * {@code POST  /quotes} : Create a new quote.
     *
     * @param quote the quote to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new quote, or with status {@code 400 (Bad Request)} if the quote has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/quotes")
    public ResponseEntity<Quote> createQuote(@Valid @RequestBody Quote quote) throws URISyntaxException {
        log.debug("REST request to save Quote : {}", quote);
        if (quote.getId() != null) {
            throw new BadRequestAlertException("A new quote cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Quote result = quoteRepository.save(quote);
        return ResponseEntity
            .created(new URI("/api/quotes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /quotes/:id} : Updates an existing quote.
     *
     * @param id the id of the quote to save.
     * @param quote the quote to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated quote,
     * or with status {@code 400 (Bad Request)} if the quote is not valid,
     * or with status {@code 500 (Internal Server Error)} if the quote couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/quotes/{id}")
    public ResponseEntity<Quote> updateQuote(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Quote quote)
        throws URISyntaxException {
        log.debug("REST request to update Quote : {}, {}", id, quote);
        if (quote.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, quote.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!quoteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Quote result = quoteRepository.save(quote);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, quote.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /quotes/:id} : Partial updates given fields of an existing quote, field will ignore if it is null
     *
     * @param id the id of the quote to save.
     * @param quote the quote to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated quote,
     * or with status {@code 400 (Bad Request)} if the quote is not valid,
     * or with status {@code 404 (Not Found)} if the quote is not found,
     * or with status {@code 500 (Internal Server Error)} if the quote couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/quotes/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Quote> partialUpdateQuote(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Quote quote
    ) throws URISyntaxException {
        log.debug("REST request to partial update Quote partially : {}, {}", id, quote);
        if (quote.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, quote.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!quoteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Quote> result = quoteRepository
            .findById(quote.getId())
            .map(
                existingQuote -> {
                    if (quote.getName() != null) {
                        existingQuote.setName(quote.getName());
                    }
                    if (quote.getQuoteDate() != null) {
                        existingQuote.setQuoteDate(quote.getQuoteDate());
                    }

                    return existingQuote;
                }
            )
            .map(quoteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, quote.getId().toString())
        );
    }

    /**
     * {@code GET  /quotes} : get all the quotes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of quotes in body.
     */
    @GetMapping("/quotes")
    public List<Quote> getAllQuotes() {
        log.debug("REST request to get all Quotes");
        return quoteRepository.findAll();
    }

    /**
     * {@code GET  /quotes/:id} : get the "id" quote.
     *
     * @param id the id of the quote to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the quote, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/quotes/{id}")
    public ResponseEntity<Quote> getQuote(@PathVariable Long id) {
        log.debug("REST request to get Quote : {}", id);
        Optional<Quote> quote = quoteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(quote);
    }

    /**
     * {@code DELETE  /quotes/:id} : delete the "id" quote.
     *
     * @param id the id of the quote to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/quotes/{id}")
    public ResponseEntity<Void> deleteQuote(@PathVariable Long id) {
        log.debug("REST request to delete Quote : {}", id);
        quoteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
