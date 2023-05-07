import React from "react";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";
import * as BiIcons from "react-icons/bi";
import * as CgIcons from "react-icons/cg";
import * as Constants from '../../pages/constants';


// 'title' provides text for each tab
// 'path' provides a link/reference to a page
// 'icon' provides an icon for each tab
// 'cName' is the CSS class name for that object 


// for the "Dashboard" section of the sidebar
export const SidebarAdminDataDashbaord = [
    // General dashboard page
    {
        title: Constants.DASHBOARD,
        path: Constants.DevHomeURL,
        icon: <FaIcons.FaHome />,
        cName: 'flexListItem'
    },
    {
        title: Constants.ADMINISTRATOR,
        path: Constants.DevAdminURL,
        icon: <FaIcons.FaUserCog />,
        cName: 'flexListItem'
    },
    {
        title: Constants.HOSPITALS,
        path: Constants.DevHospitalURL,
        icon: <FaIcons.FaHospitalSymbol />,
        cName: 'flexListItem'
    },
    {
        title: Constants.POLICE,
        path: Constants.DevPoliceURL,
        icon: <FaIcons.FaBuilding />,
        cName: 'flexListItem'
    },
    {
        title: Constants.AMBULANCE,
        path: Constants.DevAmbulanceURL,
        icon: <FaIcons.FaAmbulance />,
        cName: 'flexListItem'
    },
]

// for the "Notifications" section of the sidebar
export const SidebarAdminDataNotifications = [
    {
        title: "Messages",
        path: "#",
        icon: <BiIcons.BiMessageDetail />,
        cName: 'flexListItem'
    },
    {
        title: "Reports",
        path: "#",
        icon: <MdIcons.MdReportProblem />,
        cName: 'flexListItem'
    },
]

// for the "Settings" section of the sidebar
export const SidebarAdminDataSettings = [
    {
        title: Constants.PROFILE,
        path: Constants.DevProfileURL,
        icon: <CgIcons.CgProfile />,
        cName: 'flexListItem'
    },
    {
        title: Constants.ABOUT,
        path: Constants.DevAboutURL,
        icon: <FaIcons.FaInfo />,
        cName: 'flexListItem'
    },
]
