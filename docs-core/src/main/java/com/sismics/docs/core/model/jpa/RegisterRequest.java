// 路径建议：com.sismics.docs.core.model.jpa.RegisterRequest.java
package com.sismics.docs.core.model.jpa;

import jakarta.persistence.*;
import java.util.Date;
import java.util.UUID;

@Entity
@Table(name = "T_REGISTER_REQUEST")
public class RegisterRequest {
    @Id
    @Column(name = "RRQ_ID_C")
    private String id;

    @Column(name = "RRQ_USERNAME_C")
    private String username;

    @Column(name = "RRQ_EMAIL_C")
    private String email;

    @Column(name = "RRQ_MESSAGE_C")
    private String message;

    @Column(name = "RRQ_STATUS_C")
    private String status; // pending / approved / rejected

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "RRQ_CREATEDATE_D")
    private Date createDate;

    public RegisterRequest() {
        this.id = UUID.randomUUID().toString();
        this.createDate = new Date();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }
}
