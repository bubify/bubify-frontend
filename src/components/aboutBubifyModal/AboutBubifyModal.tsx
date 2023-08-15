import { createStyles, Grid, List, ListItem, makeStyles, Theme, Typography } from "@material-ui/core";
import clsx from "clsx";
import bubobubo from "../../images/bubobubo/eurasian-eagle-owl-bubo-bubo.jpg";

interface Props {
  closeModal: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    ModalStyle: {
      position: "relative" as "relative",
      left: "5vw",
      top: "10vh",
      overflow: "auto",
      // eslint-disable-next-line
      ['@media (min-width:800px)']: {
        position: "auto" as "auto",
        top: "50vh",
        left: "50%",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        overflow: "scroll",
        marginBottom: "10px"
      }
    },
    paper: {
      maxHeight: "87vh",
      width: "90%",
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 2, 2),
      // eslint-disable-next-line
      ['@media (min-width:800px)']: {
        position: "absolute" as "absolute",
        width: "80%",
        heigh: "100%",
        maxWidth: "400px",
        "max-height": "90%",
        "overflow-y": "auto",
        overflow: "scroll",
      }
    }
  }
  ));

function AboutBubifyModal(props: Props) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.paper, classes.ModalStyle)}>
      <div style={{ width: "100%", textAlign: "center" }}>
        <img src={bubobubo} style={{ maxWidth: "400px", width: "80%" }} alt="" />
        <Typography>
          "Nothing in life is to be feared; it is only to be understood." &mdash; <a target="_blank" href="https://en.wikipedia.org/wiki/Marie_Curie" rel="noopener noreferrer">
            Marie Curie
          </a>
        </Typography>
      </div>
      <hr />
      <Typography variant="h6">Contributors</Typography>
      <Grid spacing={1}>
        <Grid item xs={12} spacing={1}>
          <List style={{ display: "flex", flexDirection: "row" }}>
            <ListItem>
              Jonas Norlinder
            </ListItem>
            <ListItem>
              Tobias Wrigstad
            </ListItem>
            <ListItem>
              Travis Persson
            </ListItem>
          </List>
          <List style={{ display: "flex", flexDirection: "row" }}>
            <ListItem>
              Amanda Stjerna
            </ListItem>
            <ListItem>
              Astrid Rehn
            </ListItem>
            <ListItem>

            </ListItem>
          </List>
        </Grid>
      </Grid>
      <div style={{marginTop: "10px"}}>Do you have ideas or opinions on how to do things better, share them with <a href="mailto:jonas.norlinder@it.uu.se?subject=Bubify suggestions">us</a>! We welcome junior and senior experienced developers to <a href="https://bubify.github.io/">join</a> in on the fun. If you feel that your course uses inferior tools and should use Bubify instead, mail the course director and we could maybe make it happen!</div>
    </div >
  );
}

export default AboutBubifyModal;
