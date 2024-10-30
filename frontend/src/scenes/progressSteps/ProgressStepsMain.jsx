import React, { useState } from 'react';
import ProgressSteps from './ProgressSteps/ProgressSteps';
import styles from './ProgressStepsMain.module.scss';
import Button from '../../components/Button/Button';
import CheckboxHRM from '../../components/Checkbox/CheckboxHRM';
import TeamMembersList from './ProgressSteps/TeamMemberList/TeamMembersList';
import { useNavigate } from "react-router-dom";
import { setOrganisation } from '../../services/teamServices';
import { sendInvites } from '../../services/inviteService';
import { CircularProgress } from '@mui/material';


const ProgressStepsMain = () => {
    const navigate = useNavigate();
    const NUMBER_OF_STEPS = 4;
    const [step, setStep] = useState(1);
    const [teamMembersEmails, setTeamMembersEmails] = useState([]);
    const [organizationName, setOrganizationName] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [orgError, setOrgError] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [orgErrorMessage, setOrgErrorMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidOrgName = (orgName) => orgName.length > 0;

    const sendInvitesAndSetOrgName = async () => {
        try {
            setError(false);
            setLoading(true);
            let inviteResponse, orgSetResponse;

            if (teamMembersEmails.length === 0) {
                orgSetResponse = await setOrganisation(organizationName);
            } else {
                orgSetResponse = await setOrganisation(organizationName);
                if (orgSetResponse.status === 201) {
                    inviteResponse = await sendInvites(teamMembersEmails);
                    if (!inviteResponse.every(response => response.status === 200)) {
                        setError(true);
                        setLoading(false);
                        setErrorMessage("An error occurred while sending invites. Please try again.");
                    } else {
                        setError(false);
                        setLoading(false);
                        navigate('/');
                    }
                } else {
                    setError(true);
                    setLoading(false);
                    setErrorMessage("An error occurred while setting the organization. Please try again.");
                }
            }
        } catch (err) {
            setError(true);
            setLoading(false);
            if (err.response?.data?.error) {
                setErrorMessage(err.response.data.error);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
        }
    }

    const addMember = (newMemberEmail) => {
        setTeamMembersEmails((prevEmails) => [...prevEmails, newMemberEmail]);
    };

    const onEmailInputChange = (event) => {
        const email = event.target.value;
        setEmailInput(email);

        // if (!isValidEmail(email)) {
        //     setEmailError(true);
        //     setEmailErrorMessage('Please enter a valid email.');
        // } else {
        //     setEmailError(false);
        //     setEmailErrorMessage('');
        // }
    }

    const handleKeyPress = (event) => {
        const email = event.target.value;
        setEmailInput(email);

        if (event.key === 'Enter') {
            if (emailInput != '' && isValidEmail(emailInput)) {
                setEmailError(false);
                setEmailErrorMessage('');
                addMember(emailInput);
                setEmailInput('')
            } else {
                setEmailError(true);
                setEmailErrorMessage('Please enter a valid email.');
            }
        }
    };

    const content = [
        {
            title: "Customize your onboarding",
            explanation: "Welcome to BlueWave Onboard. Please customize your dashboard experience here."
        },
        {
            title: "Install BlueWave Onboard now?",
            explanation: "You’ll need a small extension to use create, edit and preview your onboarding items. Your end users don’t need to install this."
        },
        {
            title: "About your organization",
            explanation: "What is your organization’s name?"
        },
        {
            title: "Congratulations!",
            explanation: "You have successfully set up your account. <br> What next? Start adding a guide, hint or a tour in your app"
        }
    ];

    const increaseStep = () => {
        if (step < NUMBER_OF_STEPS) {
            setStep(step => step + 1);
        }
    }

    const decreaseStep = () => {
        if (step > 1) {
            setStep(step => step - 1);
        }
    }

    const handleOrgNameEmpty = () => {
        if (!organizationName.trim()) {
            setOrgError(true);
            setOrgErrorMessage('An organization name is required.');
        } else {
            setOrgError(false);
            setOrgErrorMessage('');
            increaseStep();
        }
    };

    const firstPage = () => {
        return (
            <>
                <div className={styles.stepOne}>
                    <h4 style={{ marginTop: '4px' }}>Invite team members</h4>

                    <div className={styles.teamMembers}>
                        <input
                            type="email"
                            placeholder="ex. type john@bluewavelabs.ca and press enter"
                            value={emailInput}
                            onChange={onEmailInputChange}
                            onKeyDown={handleKeyPress}
                        />
                        {emailError && <div className={styles.errorMessage}>{emailErrorMessage}</div>}
                        <TeamMembersList members={teamMembersEmails} setMembers={setTeamMembersEmails} />
                    </div>

                </div>
                <div className={styles.buttons}>
                    <Button text='Next' sx={{ width: '107px', borderRadius: '10px !important' }} onClick={increaseStep} />
                </div>
            </>
        )
    }

    const secondPage = () => {
        return (
            <div className={styles.buttons}>
                <Button text='Previous' buttonType='secondary-grey' sx={{ width: '174px', borderRadius: '10px !important' }} onClick={decreaseStep} />
                <Button text='Install now - it’s easy' buttonType='secondary-grey' sx={{ width: '174px', borderRadius: '10px !important' }} />
                <Button text='I will do it later' sx={{ width: '148px', borderRadius: '10px !important' }} onClick={increaseStep} />
            </div>
        )
    }

    const handleOrganizationNameChange = (event) => {
        const org = event.target.value;
        setOrganizationName(org);

        if (!isValidOrgName(org)) {
            setOrgError(true);
            setOrgErrorMessage('Organisation name cannot be empty.')
        } else {
            setOrgError(false);
            setOrgErrorMessage('');
        }
    }

    const thirdPage = () => {
        return (
            <>
                <div className={styles.stepOne}>
                    <input
                        type="text"
                        placeholder="ex. Acme corp"
                        value={organizationName}
                        onChange={handleOrganizationNameChange}
                    />

                </div>
                {orgError && <div className={styles.errorMessage}>{orgErrorMessage}</div>}
                <div className={styles.buttons}>
                    <Button text='Previous' buttonType='secondary-grey' sx={{ width: '174px', borderRadius: '10px !important' }} onClick={decreaseStep} />
                    <Button text='Next' sx={{ width: '107px', borderRadius: '10px !important' }} onClick={handleOrgNameEmpty} disabled={orgError} />
                </div>
            </>
        )
    }

    const fourthPage = () => {
        return (
            <>
                <div className={styles.buttons}>
                    <Button text='Previous' buttonType='secondary-grey' sx={{ width: '174px', borderRadius: '10px !important' }} onClick={decreaseStep} />
                    <Button text='Sweet' sx={{ width: '148px', borderRadius: '10px !important' }} onClick={() => sendInvitesAndSetOrgName()} startIcon={loading ? <CircularProgress size={12} color="inherit" /> : null}
                    />
                    {error && <div className={styles.errorMessage}>{errorMessage}</div>}
                </div>
            </>
        )
    }

    const pages = [firstPage, secondPage, thirdPage, fourthPage];

    return (
        <div className={styles.container}>
            <div className={styles.skeleton}>
                <h2>{content[step - 1].title}</h2>
                <ProgressSteps stepData={NUMBER_OF_STEPS} completed={step} />
            </div>
            <div className={styles.content}>
                <h3 dangerouslySetInnerHTML={{ __html: content[step - 1].explanation }} />
                {pages[step - 1]()}
            </div>
        </div>
    )
}

export default ProgressStepsMain;
