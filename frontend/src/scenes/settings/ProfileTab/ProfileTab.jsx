import React, { useState } from "react";
import Avatar from "../../../components/Avatar/Avatar";
import styles from "./ProfileTab.module.css";
import CustomTextField from "../../../components/TextFieldComponents/CustomTextField/CustomTextField";
import Button from "../../../components/Button/Button";
import { useAuth } from "../../../services/authProvider";
import DeleteConfirmationModal from "../../../components/Modals/DeleteConfirmationModal/DeleteConfirmationModal";
import UploadModal from "../../../components/Modals/UploadImageModal/UploadModal";
import { updateUser } from "../../../services/settingServices";
import { handleProfileUpdateSuccess, handleNothingToUpdateProfile } from "../../../utils/settingsHelper";

const ProfileTab = () => {

  const { userInfo, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: userInfo.name || "",
    surname: userInfo.surname || "",
    picture: ""
  });

  const [loading, setLoading] = useState(false);

  const [openDeleteAccountModal, setOpenDeleteAccountModal] = useState(false);
  const [openUploadImageModal, setOpenUploadImageModal] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);

  const handleUploadImageModalClose = () => {
    setOpenUploadImageModal(false);
  }

  const handleDeleteAccountModalClose = () => {
    setOpenDeleteAccountModal(false);
  }

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    // remove empty or unchanged data
    let filteredFormData = Array.from(Object.entries(formData)).filter(([key, value]) => userInfo[key] !== value && value !== null && value !== '');
    if (filteredFormData.length === 0) {
      handleNothingToUpdateProfile('Nothing to update...');
      return;
    }
    // convert back to object
    filteredFormData = Object.fromEntries(filteredFormData);
    try {
      setLoading(true);
      const response = await updateUser(filteredFormData);
      handleProfileUpdateSuccess(response, updateProfile);
    } catch (e) {
      console.error('Error updating profile', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={submitHandler} className={styles.form}>
        <div className={styles.formElements}>
          <label htmlFor="first-name" className={styles.label}>
            First Name
          </label>
          <CustomTextField
            type="text"
            name="name"
            id="first-name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            style={{ flexGrow: 1, textAlign: 'right' }}
            TextFieldWidth="350px"
          />
        </div>
        <div className={styles.formElements}>
          <label htmlFor="last-name" className={styles.label}>
            Last Name
          </label>
          <CustomTextField
            type="text"
            name="surname"
            id="last-name"
            placeholder="Enter your last name"
            value={formData.surname}
            onChange={handleInputChange}
            style={{ flexGrow: 1, textAlign: 'right' }}
            TextFieldWidth="350px"
          />
        </div>
        <div className={styles.formElements}>
          <div className={styles.labelElements}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <p className={styles.supportText}>
              This is your current email address -- it cannot be changed.
            </p>
          </div>
          <CustomTextField
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={userInfo.email}
            disabled={true} // Disabled since it cannot be changed
            style={{ flexGrow: 1, textAlign: 'right' }}
            TextFieldWidth="350px"
          />
        </div>
        <div className={styles.photoElements}>
          <div>
            <label htmlFor="photo" className={styles.label}>
              Your Photo
            </label>
            <div className={styles.photoAlign}>
              <p className={styles.supportText}>
                This photo will be displayed on your profile page.
              </p>
              <div className={styles.photoOptions}>
                <Avatar src="/vendetta.png" alt="User" size="large" />
                <div>
                  <button className={styles.delete}>Delete</button>
                  <button onClick={() => setOpenUploadImageModal(!openUploadImageModal)} className={styles.update}>Update</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.saveButton}>
          <Button
            text="Save"
            type="submit"
            loading={loading}
            style={{ width: '120px', marginTop: '40px' }}
          />
        </div>
      </form>
      <div>
        <h4 className={styles.label}>Delete Account</h4>
        <p className={styles.supportText}>
          Note that deleting your account will remove all data from our system. This is permanent and non-recoverable.
        </p>
        <Button onClick={() => setOpenDeleteAccountModal(!openDeleteAccountModal)} text="Delete Account" buttonType="error" style={{ padding: '6px  20px', marginTop: '35px' }} />
      </div>
      <DeleteConfirmationModal open={openDeleteAccountModal} handleClose={handleDeleteAccountModalClose} />
      <UploadModal
        uploadedFile={uploadedFile}
        setUploadedFile={setUploadedFile}
        open={openUploadImageModal}
        handleClose={handleUploadImageModalClose}
      />
    </>
  );
};

export default ProfileTab;
