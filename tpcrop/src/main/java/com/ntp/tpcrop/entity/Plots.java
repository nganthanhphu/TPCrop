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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author Joon
 */
@Entity
@Table(name = "plots")
@NamedQueries({
    @NamedQuery(name = "Plots.findAll", query = "SELECT p FROM Plots p"),
    @NamedQuery(name = "Plots.findById", query = "SELECT p FROM Plots p WHERE p.id = :id"),
    @NamedQuery(name = "Plots.findBySize", query = "SELECT p FROM Plots p WHERE p.size = :size"),
    @NamedQuery(name = "Plots.findByAddress", query = "SELECT p FROM Plots p WHERE p.address = :address")})
public class Plots implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Long id;
    @Basic(optional = false)
    @Column(name = "size")
    private double size;
    @Basic(optional = false)
    @Column(name = "address")
    private String address;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "plotId", fetch = FetchType.LAZY)
    private Set<TaskCompletions> taskCompletionsSet;
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "plot_crops",
        joinColumns = @JoinColumn(name = "plot_id"),
        inverseJoinColumns = @JoinColumn(name = "crop_id")
    )
    private Set<Crops> cropsSet;
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Users userId;

    public Plots() {
    }

    public Plots(Long id) {
        this.id = id;
    }

    public Plots(Long id, double size, String address) {
        this.id = id;
        this.size = size;
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getSize() {
        return size;
    }

    public void setSize(double size) {
        this.size = size;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Set<TaskCompletions> getTaskCompletionsSet() {
        return taskCompletionsSet;
    }

    public void setTaskCompletionsSet(Set<TaskCompletions> taskCompletionsSet) {
        this.taskCompletionsSet = taskCompletionsSet;
    }

    public Set<Crops> getCropsSet() {
        return cropsSet;
    }

    public void setCropsSet(Set<Crops> cropsSet) {
        this.cropsSet = cropsSet;
    }

    public Users getUserId() {
        return userId;
    }

    public void setUserId(Users userId) {
        this.userId = userId;
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
        if (!(object instanceof Plots)) {
            return false;
        }
        Plots other = (Plots) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.ntp.tpcrop.entity.Plots[ id=" + id + " ]";
    }
    
}
