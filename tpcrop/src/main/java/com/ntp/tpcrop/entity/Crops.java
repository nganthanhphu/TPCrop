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
@Table(name = "crops")
@NamedQueries({
    @NamedQuery(name = "Crops.findAll", query = "SELECT c FROM Crops c"),
    @NamedQuery(name = "Crops.findById", query = "SELECT c FROM Crops c WHERE c.id = :id"),
    @NamedQuery(name = "Crops.findByName", query = "SELECT c FROM Crops c WHERE c.name = :name"),
    @NamedQuery(name = "Crops.findByIsSupportChatbot", query = "SELECT c FROM Crops c WHERE c.isSupportChatbot = :isSupportChatbot")})
public class Crops implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Long id;
    @Basic(optional = false)
    @Column(name = "name")
    private String name;
    @Column(name = "is_support_chatbot")
    private Boolean isSupportChatbot;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "cropId", fetch = FetchType.LAZY)
    private List<Seasons> seasonsList;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "cropId", fetch = FetchType.LAZY)
    private List<Plots> plotsList;

    public Crops() {
    }

    public Crops(Long id) {
        this.id = id;
    }

    public Crops(Long id, String name) {
        this.id = id;
        this.name = name;
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

    public Boolean getIsSupportChatbot() {
        return isSupportChatbot;
    }

    public void setIsSupportChatbot(Boolean isSupportChatbot) {
        this.isSupportChatbot = isSupportChatbot;
    }

    public List<Seasons> getSeasonsList() {
        return seasonsList;
    }

    public void setSeasonsList(List<Seasons> seasonsList) {
        this.seasonsList = seasonsList;
    }

    public List<Plots> getPlotsList() {
        return plotsList;
    }

    public void setPlotsList(List<Plots> plotsList) {
        this.plotsList = plotsList;
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
        if (!(object instanceof Crops)) {
            return false;
        }
        Crops other = (Crops) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ntp.tpcrop.entity.Crops[ id=" + id + " ]";
    }
    
}
