package agh.io.iobackend.model;

import java.io.ByteArrayOutputStream;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import javax.imageio.ImageIO;

public class ImageToByte {
    public static byte[] imageToByte(String imgPath){

        // Try to locate an image, if failed throw exception
        InputStream inputStream = ImageToByte.class.getClassLoader().getResourceAsStream(imgPath);
        if (inputStream == null) {
            throw new IllegalArgumentException("file " + imgPath + " not fount!");
        }

        // Serialize an image to the byte array
        BufferedImage bImage;
        try {
            bImage = ImageIO.read(inputStream);
        } catch (IOException e) {
            System.out.println("[Read] Can not read " + imgPath + " file!");
            return null;
        }
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        try {
            ImageIO.write(bImage, "png", bos );
        } catch (IOException e) {
            System.out.println("[Write] Can not serialize image " + imgPath + "!");
        }

        return bos.toByteArray();
    }
}
