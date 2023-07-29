// Start Imports
import React from "react";
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@mui/material";
import TopNavbar from "../components/TopNavbar/TopNavbar";
import Sidebar from "../components/SideBar/Sidebar";
import styles from "../styles/About.module.css";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PROJECT_NAME } from "./constants";
import * as Constants from "../pages/constants";

export default function about() {
  return (
    <div>
      <TopNavbar />
      <div className={styles.collector}>
        <Sidebar />
        <div className={styles.container}>
          <h1>{Constants.PROJECT_NAME}</h1>
          <Image
            src="/AISLogo.png"
            alt={Constants.PROJECT_ABR + " Logo"}
            width="150"
            height="150"
          />
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            # {Constants.PROJECT_NAME}
          </ReactMarkdown>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            ### MVP V2 built by: Owen Campbell, Will Klaus, and Dalong Wang
          </ReactMarkdown>
          <List
            sx={{ width: "50%", margin: "auto", bgcolor: "background.paper" }}
            className={styles.mobileFull}
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Suman Bhunia" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Suman Bhunia"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Product Customer
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Owen Campbell" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Owen Campbell"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Product Owner and lead Solidity developer: Communicates
                      necessary information between the client and the team
                      along with creating user stories for the team to be tasked
                      out. Writes and updates Solidity code to be compatible
                      with the Avalanche blockchain.
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Dalong Wang" src="/static/images/avatar/3.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Dalong Wang"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Scrum master and React developer: Facilitate meetings and
                      make agendas for meetings when necessary. Updates user
                      interface for improved user experience.
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Will Klaus" src="/static/images/avatar/3.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Will Klaus"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Lead database devloper and React developer: Manages
                      database system and managed transition to a relational
                      database for improved structure and responsiveness.
                      Updates user interface to provide additional functionality
                      to users.
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>
          <Divider variant="inset" />
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            # {Constants.PROJECT_NAME}
          </ReactMarkdown>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            ### MVP built by: Matt Blackert, Max Beedy, Jorge Nadjar, and Zach
            Katz
          </ReactMarkdown>
          <List
            sx={{ width: "50%", margin: "auto", bgcolor: "background.paper" }}
            className={styles.mobileFull}
          >
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Suman Bhunia" src="/static/images/avatar/1.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Suman Bhunia"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Product Customer
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Matt Blackert" src="/static/images/avatar/2.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Matt Blackert"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Project owner, manages the roadmap of the project and
                      helps to provide communication between the client and the
                      team.
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Jorge Nadjar" src="/static/images/avatar/3.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Jorge Nadjar"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Scrum master, plans the tasks inside of our project
                      management software and builds the database and functions
                      to store data in our application.
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Max Beedy" src="/static/images/avatar/3.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Max Beedy"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Lead UX/UI designer, builds the underlying pages and
                      formats the styles of the pages to ensure consistency
                      throughout the application.
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt="Zach Katz" src="/static/images/avatar/3.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary="Zach Katz"
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Lead Solidity developer, modifies and creates Solidity
                      code to allow our application to run on-chain.
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            # Color Scheme
          </ReactMarkdown>
          <Link
            href="https://www.medicinenet.com/medical_triage_code_tags_and_triage_terminology/views.htm"
            passHref
          >
            <Chip label="Our Source" variant="outlined" />
          </Link>
          <Card sx={{ display: "flex" }} className={styles.colorCard}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto", textAlign: "left" }}>
                <Typography component="div" variant="h5">
                  Red
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="div"
                >
                  Reserved for patients who cannot survive without immediate
                  treatment but who have a chance of survival.
                </Typography>
              </CardContent>
            </Box>
            <Box sx={{ minWidth: "100px", backgroundColor: "red" }}></Box>
          </Card>
          <Card sx={{ display: "flex" }} className={styles.colorCard}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto", textAlign: "left" }}>
                <Typography component="div" variant="h5">
                  Yellow
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="div"
                >
                  Individuals who require attention (and possible later
                  re-triage). These patients are not in any immediate danger of
                  death.
                </Typography>
              </CardContent>
            </Box>
            <Box sx={{ minWidth: "100px", backgroundColor: "yellow" }}></Box>
          </Card>
          <Card sx={{ display: "flex" }} className={styles.colorCard}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto", textAlign: "left" }}>
                <Typography component="div" variant="h5">
                  Green
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="div"
                >
                  People who will need medical care at some point, after more
                  critical injuries have been treated.
                </Typography>
              </CardContent>
            </Box>
            <Box sx={{ minWidth: "100px", backgroundColor: "green" }}></Box>
          </Card>
          <Card sx={{ display: "flex" }} className={styles.colorCard}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto", textAlign: "left" }}>
                <Typography component="div" variant="h5">
                  Light Blue
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="div"
                >
                  This flag is reserved for minor injuries for whom a
                  doctor&lsquo;s care is not required. These are patients that
                  are at a low risk.
                </Typography>
              </CardContent>
            </Box>
            <Box sx={{ minWidth: "100px", backgroundColor: "lightblue" }}></Box>
          </Card>
          <Card sx={{ display: "flex" }} className={styles.colorCard}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flex: "1 0 auto", textAlign: "left" }}>
                <Typography component="div" variant="h5">
                  Black
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="div"
                >
                  Color used for the deceased and for individual injuries&lsquo;
                  which are so extensive that they will not be able to survive
                  given the care that is available.
                </Typography>
              </CardContent>
            </Box>
            <Box sx={{ minWidth: "100px", backgroundColor: "black" }}></Box>
          </Card>
        </div>
      </div>
    </div>
  );
}
