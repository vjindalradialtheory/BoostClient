package com.boostclient.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "employees" }, allowSetters = true)
    private Employer employer;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "employees" }, allowSetters = true)
    private Employer employer;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employee id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Employee name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return this.dateOfBirth;
    }

    public Employee dateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
        return this;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Employer getEmployer() {
        return this.employer;
    }

    public Employee employer(Employer employer) {
        this.setEmployer(employer);
        return this;
    }

    public void setEmployer(Employer employer) {
        this.employer = employer;
    }

    public Employer getEmployer() {
        return this.employer;
    }

    public Employee employer(Employer employer) {
        this.setEmployer(employer);
        return this;
    }

    public void setEmployer(Employer employer) {
        this.employer = employer;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employee)) {
            return false;
        }
        return id != null && id.equals(((Employee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", dateOfBirth='" + getDateOfBirth() + "'" +
            "}";
    }
}
