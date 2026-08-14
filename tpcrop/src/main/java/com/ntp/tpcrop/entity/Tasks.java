/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ntp.tpcrop.entity;

import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "tasks")
@NamedQueries({
    @NamedQuery(name = "Tasks.findAll", query = "SELECT t FROM Tasks t"),
    @NamedQuery(name = "Tasks.findById", query = "SELECT t FROM Tasks t WHERE t.id = :id"),
    @NamedQuery(name = "Tasks.findByDescription", query = "SELECT t FROM Tasks t WHERE t.description = :description"),
    @NamedQuery(name = "Tasks.findByStartDate", query = "SELECT t FROM Tasks t WHERE t.startDate = :startDate"),
    @NamedQuery(name = "Tasks.findByEndDate", query = "SELECT t FROM Tasks t WHERE t.endDate = :endDate")})
public class Tasks implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Long id;
    @Basic(optional = false)
    @Column(name = "description")
    private String description;
    @Basic(optional = false)
    @Column(name = "start_date")
    private LocalDate startDate;
    @Basic(optional = false)
    @Column(name = "end_date")
    private LocalDate endDate;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "taskId", fetch = FetchType.LAZY)
    private List<TaskCompletions> taskCompletionsList;
    @JoinColumn(name = "season_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Seasons seasonId;

    public Tasks() {
    }

    public Tasks(Long id) {
        this.id = id;
    }

    public Tasks(Long id, String description, LocalDate startDate, LocalDate endDate) {
        this.id = id;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public List<TaskCompletions> getTaskCompletionsList() {
        return taskCompletionsList;
    }

    public void setTaskCompletionsList(List<TaskCompletions> taskCompletionsList) {
        this.taskCompletionsList = taskCompletionsList;
    }

    public Seasons getSeasonId() {
        return seasonId;
    }

    public void setSeasonId(Seasons seasonId) {
        this.seasonId = seasonId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Tasks)) {
            return false;
        }
        Tasks other = (Tasks) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ntp.tpcrop.entity.Tasks[ id=" + id + " ]";
    }
    
}
