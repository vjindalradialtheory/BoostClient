package com.boostclient.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Employer.
 */
@Entity
@Table(name = "employer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Employer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "employer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "employer" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Employer id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Employer name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public Employer employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Employer addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setEmployer(this);
        return this;
    }

    public Employer removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setEmployer(null);
        return this;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.setEmployer(null));
        }
        if (employees != null) {
            employees.forEach(i -> i.setEmployer(this));
        }
        this.employees = employees;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employer)) {
            return false;
        }
        return id != null && id.equals(((Employer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employer{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
