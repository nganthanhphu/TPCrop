package com.ntp.tpcrop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
@PropertySource("classpath:cloudinary.properties")
public class CloudinaryConfig {

    private final Environment env;

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", this.env.getProperty("cloudinary.cloud_name"),
                "api_key", this.env.getProperty("cloudinary.api_key"),
                "api_secret", this.env.getProperty("cloudinary.api_secret"),
                "secure", true));
    }

}
