package agh.io.iobackend.model.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Proxy;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
@Builder
@Proxy(lazy = false) // for tests
public class User {

    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_sequence"
    )
    @Column(name = "user_id")
    private Long userId;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] avatar;

    @Column(unique = true)
    private String login;

    @Column(unique = true)
    private String email;

    private String password;

    @PrePersist
    void preInsert() {
        if (this.avatar == null) {
            this.avatar = ImageToByte.imageToByte("images/avatar_default.png");
        }
    }

}
