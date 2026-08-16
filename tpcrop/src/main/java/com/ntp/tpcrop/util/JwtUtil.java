package com.ntp.tpcrop.util;

import java.text.ParseException;
import java.util.Date;

import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.KeyLengthException;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.ntp.tpcrop.entity.Users;

@Component
@PropertySource("classpath:application.properties")
public class JwtUtil {

    private final String SECRET;
    private final long EXPIRATION_TIME;

    public JwtUtil(Environment env) {
        this.SECRET = env.getProperty("jwt.secret");
        this.EXPIRATION_TIME = Long.parseLong(env.getProperty("jwt.expiration"));
    }

    public String generateToken(Users user) throws KeyLengthException, JOSEException {
        JWSSigner signer = new MACSigner(SECRET);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .expirationTime(new Date(System.currentTimeMillis() + this.EXPIRATION_TIME))
                .issueTime(new Date())
                .claim("id", user.getId())
                .claim("role", user.getRole())
                .claim("isActive", user.getActive())
                .build();

        SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claimsSet);

        signedJWT.sign(signer);
        
        return signedJWT.serialize();
    }

    public JWTClaimsSet validateTokenAndGetClaims(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifer = new MACVerifier(this.SECRET);

        if (signedJWT.verify(verifer)) {
            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expirationTime != null && expirationTime.after(new Date())){
                return signedJWT.getJWTClaimsSet();
            }
        }
        return null;
    }

}