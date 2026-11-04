import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";

import Title from "../../../../components/title";
import TestPreLoader from "../../../../pages/TestPreLoader/TestPreLoader";
import { marketingService } from "../../services/marketingService";
import "./DesignAttachments.css";

function DesignAttachments() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const [error, setError] = useState({});

  const getPhoto = async () => {
    try {
      const res = await marketingService.getProjectUploads(id);
      setImages(res.data);
      setLoading(false);
    } catch (err) {
      setError(err?.response?.data?.errors || {});
      setLoading(false);
    }
  };

  useEffect(() => {
    getPhoto();
  }, [id]);

  const openModal = (src) => {
    setImageSrc(src);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setImageSrc("");
  };

  const handleCheckboxChange = (src) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.includes(src)
        ? prevSelectedImages.filter((image) => image !== src)
        : [...prevSelectedImages, src]
    );
  };

  const handleSelectAll = () => {
    setSelectedImages(
      selectedImages.length === images.length ? [] : images.map((img) => img)
    );
  };

  const handleDownload = () => {
    selectedImages.forEach((src) => {
      const fileName = src.split("/").pop().split("?")[0];
      saveAs(src, fileName);
    });
  };

  if (loading) {
    return <TestPreLoader />;
  }

  return (
    <>
      <div className="designattachments">
        <Title
          title="عرض المرفقات"
          icon={<FontAwesomeIcon icon={faPaperclip} />}
        />
        <div className="designattachments-container">
          <div className="attachSelect">
            <button className="styled-download-button" onClick={handleSelectAll}>
              تحديد الكل
            </button>
          </div>

          <div className="attachments-row">
            {images.map((image, index) => (
              <div key={index} className="attachmentElementCont">
                <div className="attachmentElement" id="scrollimage">
                  <img
                    width="100%"
                    height="100%"
                    src={image}
                    alt={"مرفق " + (index + 1)}
                    onClick={() => openModal(image)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="attachmentElementText">
                  <input
                    type="checkbox"
                    className="minus-checkbox"
                    checked={selectedImages.includes(image)}
                    onChange={() => handleCheckboxChange(image)}
                  />
                  <p className="attachName">{"مرفق " + (index + 1)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="attachments-row">
            <button className="attachdownload" onClick={handleDownload}>
              تحميل
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
      >
        <div className="modal-content">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <img src={imageSrc} alt="Attachment" style={{ width: "100%" }} />
        </div>
      </Modal>
    </>
  );
}

export default DesignAttachments;

