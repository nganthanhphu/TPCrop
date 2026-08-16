package com.ntp.tpcrop.util;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Logger;

import org.springframework.stereotype.Component;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CloudinaryUtil {

    private final Cloudinary cloudinary;

    public String uploadFile(byte[] file){
        try {
            Map<?, ?> result = this.cloudinary.uploader().upload(file, ObjectUtils.asMap("resource_type", "auto"));
            return result.get("secure_url").toString();
        } catch (IOException e) {
            Logger.getLogger(CloudinaryUtil.class.getName()).severe("Failed to upload file to Cloudinary: " + e.getMessage());
            return null;
        }
    }
}
