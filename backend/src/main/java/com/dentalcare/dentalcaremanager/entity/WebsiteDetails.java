package com.dentalcare.dentalcaremanager.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@EqualsAndHashCode(callSuper = false)
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "websiteDetails")
public class WebsiteDetails extends AbstractEntity{

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "key", nullable = false)
	@SequenceGenerator(name = "websiteDetails_seq", sequenceName = "websiteDetails_seq", initialValue = 1, allocationSize = 1)
	@GeneratedValue(strategy = GenerationType.AUTO, generator = "websiteDetails_seq")
	private Long key;
	
	@Column(nullable = false, length = 3000)
	private String websiteName;
	
	@Column(nullable = false, length = 3000)
	private String websiteNameMr;
	
	@Column(length = 3000)
	private String websiteNameHi;
	
	private String oldWebsiteLink;

	private String websiteLogo;
	
	@OneToMany(mappedBy = "website", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<WebsiteSocialLink> socialLinks;

	@Column(length = 50)
	private String shortAddress;
	
	@Column(length = 500)
	private String address;

	@Column(length = 100)
	private String email;

	@Column(length = 50)
	private String phone;

	@Column(length = 50)
	private String openingHours;
	
	
	 
}