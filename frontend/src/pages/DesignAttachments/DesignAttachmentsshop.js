import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import Title from "../../components/title";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./DesignAttachments.css";
import { saveAs } from "file-saver";
import API from "../../api/axiosConfig";
import { useParams } from "react-router";
import TestPreLoader from "../TestPreLoader/TestPreLoader";

function DesignAttachmentsshop() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  // List of images to avoid repeating URLs
  const [images , setImages] = useState([]);
  const [loading , setLoading] = useState(true);
  const {id} = useParams();
  const [error , setError] = useState({})

  const getPhoto = async() =>
  {
    try{

      const res = await API.get(`shopdetails/${id}/uploads`);
      const data = await res;
      setImages(data.data)
      setLoading(false)
    }catch(error)
    {
      setError(error.response.data.errors)
    }
  }

  useEffect(() => {
    getPhoto()
  },[])

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
    // If all images are selected, unselect them. Otherwise, select all.
    setSelectedImages(selectedImages.length === images.length ? [] : images.map((img) => img.src));
  };

  const handleDownload = () => {
    selectedImages.forEach((imageSrc) => {
      const fileName = imageSrc.split("/").pop().split("?")[0]; 
      saveAs(imageSrc, fileName); 
    });
  };

  return (
    loading ? <TestPreLoader /> :
    <>
      <div className="designattachments">
        <Title title="عرض المرفقات" icon={<FontAwesomeIcon icon={faPaperclip} />} />
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
                    alt={"مرفق " + (index+1)}
                    onClick={() => openModal(image.src)}
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
                  <p className="attachName">{"مرفق "+ (index+1)}</p>
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

      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Image Modal">
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

export default DesignAttachmentsshop;
