// 路径建议：com.sismics.docs.core.dao.RegisterRequestDao.java
package com.sismics.docs.core.dao;

import com.sismics.docs.core.model.jpa.RegisterRequest;
import com.sismics.util.context.ThreadLocalContext;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.util.List;

public class RegisterRequestDao {
    public void create(RegisterRequest request) {
        EntityManager em = ThreadLocalContext.get().getEntityManager();
        em.persist(request);
    }

    public List<RegisterRequest> findAllPending() {
        EntityManager em = ThreadLocalContext.get().getEntityManager();
        Query query = em.createQuery("SELECT r FROM RegisterRequest r WHERE r.status = 'pending'");
        return query.getResultList();
    }

    public RegisterRequest getById(String id) {
        EntityManager em = ThreadLocalContext.get().getEntityManager();
        return em.find(RegisterRequest.class, id);
    }

    public void update(RegisterRequest request) {
        EntityManager em = ThreadLocalContext.get().getEntityManager();
        em.merge(request);
    }

    public void delete(RegisterRequest request) {
        EntityManager em = ThreadLocalContext.get().getEntityManager();
        em.remove(request);
    }

    public List<RegisterRequest> findAll() {
        EntityManager em = ThreadLocalContext.get().getEntityManager();
        return em.createQuery("select r from RegisterRequest r order by r.createDate desc", RegisterRequest.class)
                .getResultList();
    }

}
