import { useState, useEffect, useRef } from "react";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../firebaseConfig";
import "./photoSection.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import emailjs from "emailjs-com";
import { get } from "firebase/database";

const PhotoUploadSection = ({ photos = [], onPhotosChange }) => {
  const [uploadedPhotos, setUploadedPhotos] = useState(() =>
    photos.length ? [...new Set(photos)] : []
  );
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("");
  const fileInputRef = useRef(null); // Référence pour le champ fichier

  const sliderSettings = {
    dots: true,
    infinite: false, // Désactiver le défilement infini
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  
  

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    const uploadedPhotoDetails = [...uploadedPhotos];

    setUploading(true);
    try {
      for (const file of files) {
        const timestamp = new Date().toISOString();
        const filePath = `photos/${timestamp}_${file.name}`;
        const storageRef = ref(storage, filePath);

        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        if (!uploadedPhotoDetails.some((photo) => photo.url === downloadURL)) {
          uploadedPhotoDetails.push({
            url: downloadURL,
            path: filePath,
            timestamp,
            category: category || "Uncategorized",
          });
        }
      }

      setUploadedPhotos(uploadedPhotoDetails);
      onPhotosChange?.(uploadedPhotoDetails);
    } catch (error) {
      console.error("Erreur lors de l'upload des photos :", error);
      alert("Erreur lors de l'upload des photos.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (index) => {
    const updatedPhotos = [...uploadedPhotos];
    const [removedPhoto] = updatedPhotos.splice(index, 1);

    try {
      const photoRef = ref(storage, removedPhoto.path);
      await deleteObject(photoRef);
      setUploadedPhotos(updatedPhotos);
      if (onPhotosChange) {
        onPhotosChange(updatedPhotos);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la photo :", error);
      alert("Erreur lors de la suppression de la photo.");
    }
  };

  const handleAddImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const sendEmail = () => {
    const emailData = {
      to_email: "chris9306@hotmail.fr",
      subject: "Photos Suivi Visuel",
      photos: uploadedPhotos.map((photo) => photo.url).join("\n"),
    };

    emailjs
      .send("service_mx9acsp", "template_kt1vnxm", emailData, "3OSs-9t0ItkYc4v2Y")
      .then(() => alert("E-mail envoyé avec succès !"))
      .catch((error) => alert("Erreur lors de l'envoi de l'e-mail."));
  };

  useEffect(() => {
    if (photos.length) {
      const uploaded = Promise.all(photos.map(async (photo) => {
        const url = await getDownloadURL(ref(storage, photo.path));
        return { ...photo, url };
      }));
      uploaded.then((photos) => setUploadedPhotos([...new Set (photos)]));
    
    }
  }, [photos]);

  return (
    <div className="photo-upload-section">
      <h2>Suivi Visuel</h2>
      <div className="photo-category">
        <label>Catégorie :</label>
        <input
          type="text"
          placeholder="Saisissez une catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      <input
        type="file"
        ref={fileInputRef} // Attacher la référence
        accept="image/*"
        multiple
        onChange={handlePhotoUpload}
        className="photo-upload-input"
        style={{ display: "none" }} // Cacher le champ fichier
      />
      <button onClick={handleAddImageClick} disabled={uploading}>
        {uploading ? "Ajout en cours..." : "Ajouter une image"}
      </button>
        <div className="photo-gallery">
        {uploadedPhotos.map((photo, index) => {
          return(
          <div key={index} className="photo-item">
            <img src={photo.url} alt={`Uploaded ${index}`} />
            <p>Catégorie : {photo.category}</p>
            <p>Date : {new Date(photo.timestamp).toLocaleString()}</p>
            <button onClick={() => handleDeletePhoto(index)}>Supprimer</button>
          </div>
        )})}
      </div>
      <div className="photo-slideshow">
        <h3>Diaporama</h3>
        <Slider {...sliderSettings}>
  {uploadedPhotos
    .filter((photo, index, self) => index === self.findIndex((p) => p.url === photo.url)) // Supprimer les doublons
    .map((photo, index) => (
      <div key={index}>
        <img
          src={photo.url}
          alt={`Slide ${index}`}
          style={{
            width: "35%",
            height: "auto",
            margin: "0 auto",
          }}
        />
        <p>{photo.category}</p>
        <p>{new Date(photo.timestamp).toLocaleString()}</p>
      </div>
    ))}
</Slider>
        <button onClick={sendEmail}>Envoyer par E-mail</button>
      </div>
    </div>
  );
};

export default PhotoUploadSection;