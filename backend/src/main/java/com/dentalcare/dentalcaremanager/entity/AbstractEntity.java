package com.dentalcare.dentalcaremanager.entity;

import java.io.Serializable;
import java.time.Instant;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class AbstractEntity implements Serializable{
	private static final long serialVersionUID = 1L;

	@Version
	private int version;
	
	@CreatedDate
	private Instant createdOn;
	
	@CreatedBy
	private Long createdBy;
	
	@LastModifiedDate
	private Instant updatedOn;
	
	@LastModifiedBy
	private Long updatedBy;
	
	private Character isActive;
	
	@PrePersist
	public void onPrePersist() {
		this.isActive = 'Y';
		this.createdOn = Instant.now();
	}
	
	@PreUpdate
	public void onPreUpdate() {
		this.updatedOn = Instant.now();
	}
	
	public AbstractEntity() {
		super();
	}
}
