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
import java.util.List;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "seasons")
@NamedQueries({
    @NamedQuery(name = "Seasons.findAll", query = "SELECT s FROM Seasons s"),
    @NamedQuery(name = "Seasons.findById", query = "SELECT s FROM Seasons s WHERE s.id = :id"),
    @NamedQuery(name = "Seasons.findByName", query = "SELECT s FROM Seasons s WHERE s.name = :name"),
    @NamedQuery(name = "Seasons.findByStartYear", query = "SELECT s FROM Seasons s WHERE s.startYear = :startYear"),
    @NamedQuery(name = "Seasons.findByEndYear", query = "SELECT s FROM Seasons s WHERE s.endYear = :endYear")})
public class Seasons implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Long id;
    @Basic(optional = false)
    @Column(name = "name")
    private String name;
    @Basic(optional = false)
    @Column(name = "start_year")
    private int startYear;
    @Basic(optional = false)
    @Column(name = "end_year")
    private int endYear;
    @JoinColumn(name = "crop_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Crops cropId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "seasonId", fetch = FetchType.LAZY)
    private List<Tasks> tasksList;

    public Seasons() {
    }

    public Seasons(Long id) {
        this.id = id;
    }

    public Seasons(Long id, String name, int startYear, int endYear) {
        this.id = id;
        this.name = name;
        this.startYear = startYear;
        this.endYear = endYear;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getStartYear() {
        return startYear;
    }

    public void setStartYear(int startYear) {
        this.startYear = startYear;
    }

    public int getEndYear() {
        return endYear;
    }

    public void setEndYear(int endYear) {
        this.endYear = endYear;
    }

    public Crops getCropId() {
        return cropId;
    }

    public void setCropId(Crops cropId) {
        this.cropId = cropId;
    }

    public List<Tasks> getTasksList() {
        return tasksList;
    }

    public void setTasksList(List<Tasks> tasksList) {
        this.tasksList = tasksList;
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
        if (!(object instanceof Seasons)) {
            return false;
        }
        Seasons other = (Seasons) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ntp.tpcrop.entity.Seasons[ id=" + id + " ]";
    }
    
}
