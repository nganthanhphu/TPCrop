/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ntp.tpcrop.entity;

import jakarta.persistence.Basic;
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
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "task_completions")
@NamedQueries({
    @NamedQuery(name = "TaskCompletions.findAll", query = "SELECT t FROM TaskCompletions t"),
    @NamedQuery(name = "TaskCompletions.findById", query = "SELECT t FROM TaskCompletions t WHERE t.id = :id"),
    @NamedQuery(name = "TaskCompletions.findByTimeCompleted", query = "SELECT t FROM TaskCompletions t WHERE t.timeCompleted = :timeCompleted")})
public class TaskCompletions implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Long id;
    @Column(name = "time_completed")
    private LocalDateTime timeCompleted;
    @JoinColumn(name = "plot_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Plots plotId;
    @JoinColumn(name = "task_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Tasks taskId;

    public TaskCompletions() {
    }

    public TaskCompletions(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getTimeCompleted() {
        return timeCompleted;
    }

    public void setTimeCompleted(LocalDateTime timeCompleted) {
        this.timeCompleted = timeCompleted;
    }

    public Plots getPlotId() {
        return plotId;
    }

    public void setPlotId(Plots plotId) {
        this.plotId = plotId;
    }

    public Tasks getTaskId() {
        return taskId;
    }

    public void setTaskId(Tasks taskId) {
        this.taskId = taskId;
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
        if (!(object instanceof TaskCompletions)) {
            return false;
        }
        TaskCompletions other = (TaskCompletions) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ntp.tpcrop.entity.TaskCompletions[ id=" + id + " ]";
    }
    
}
