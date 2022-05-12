package agh.io.iobackend.model;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.enhanced.SequenceStyleGenerator;

import java.io.Serializable;

public class GameRoomSequenceIdGenerator extends SequenceStyleGenerator {
    @Override
    public Serializable generate(
            SharedSessionContractImplementor session, Object object
    ) throws HibernateException {
        Long seed = (Long) super.generate(session, object);
        Long m = (long) Math.pow(2, 32);
        Long a = 22695477L;
        Long c = 1L;

        return (a * seed + c) % m;
    }
}
