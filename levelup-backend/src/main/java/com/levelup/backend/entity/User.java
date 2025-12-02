package com.levelup.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@ToString(exclude = "direcciones")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
@com.fasterxml.jackson.annotation.JsonIdentityInfo(generator = com.fasterxml.jackson.annotation.ObjectIdGenerators.PropertyGenerator.class, property = "id")
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    private String rut;

    private String tipo; // "duoc" | "normal"

    private Integer puntos;

    private String nivel; // "bronce" | "plata" | "oro" | "diamante"

    private String telefono;

    private String codigoReferido; // Código único de referido del usuario

    private Boolean activo;

    @ElementCollection
    @CollectionTable(name = "user_addresses", joinColumns = @JoinColumn(name = "user_id"))
    private List<Address> direcciones;

    @Enumerated(EnumType.STRING)
    private Role role;

    // Preferencias
    private String metodoPagoPreferido;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    private List<PaymentMethod> metodosPago;

    @ElementCollection
    @CollectionTable(name = "user_interests", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "interest")
    private List<String> intereses;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "email", column = @Column(name = "pref_email")),
            @AttributeOverride(name = "sms", column = @Column(name = "pref_sms"))
    })
    private CommunicationPreferences preferenciasComunicacion;

    // Legal
    private Boolean aceptaTerminos;

    private Boolean aceptaPoliticaPrivacidad;

    // Sistema
    @Column(name = "fecha_registro")
    private java.time.LocalDateTime fechaRegistro;

    @Column(name = "ultimo_acceso")
    private java.time.LocalDateTime ultimoAcceso;

    private String referidoPor;

    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = java.time.LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        ultimoAcceso = java.time.LocalDateTime.now();
    }

    @Override
    @com.fasterxml.jackson.annotation.JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
