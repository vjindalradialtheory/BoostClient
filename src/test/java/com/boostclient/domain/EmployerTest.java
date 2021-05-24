package com.boostclient.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.boostclient.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EmployerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Employer.class);
        Employer employer1 = new Employer();
        employer1.setId(1L);
        Employer employer2 = new Employer();
        employer2.setId(employer1.getId());
        assertThat(employer1).isEqualTo(employer2);
        employer2.setId(2L);
        assertThat(employer1).isNotEqualTo(employer2);
        employer1.setId(null);
        assertThat(employer1).isNotEqualTo(employer2);
    }
}
