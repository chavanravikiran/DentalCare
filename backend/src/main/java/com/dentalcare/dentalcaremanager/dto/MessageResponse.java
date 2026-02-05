package com.dentalcare.dentalcaremanager.dto;

import com.dentalcare.dentalcaremanager.entity.WebsiteDetails;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse<T> {

    private int status;
    private String message;
    private T body;
    
}