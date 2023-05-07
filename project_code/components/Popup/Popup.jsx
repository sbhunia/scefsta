import styles from '../../styles/Popup.module.css';
import React from 'react';
import * as MdIcons from "react-icons/md";
import Button from '@mui/material/Button';

export default function Popup(props) {
    return (props.trigger) ? (
        <div className={styles.popup}>
            <div className={styles.popupInner}>
                <Button className={styles.closeBtn} onClick={() => props.setTrigger(false)}>
                    <MdIcons.MdClose />
                </Button>
                    { props.children }
            </div>         
        </div>
    ) : ""
}
