import React, { useState, useContext } from "react";
import { GraphQLClient } from "graphql-request";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Context from "../../context";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";

const CreatePin = ({ classes }) => {
  const { state, dispatch } = useContext(Context);
  const [ title, setTitle ] = useState("");
  const [ image, setImage ] = useState("");
  const [ content, setContent ] = useState("");
  const [ submitting, setSubmitting ] = useState(false);

  const handleImageUpload = async() => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/leofloresdev/image/upload",
      data
    );

    return res.data.url;
  }

  const handleSubmit = async event => {
    try {
      event.preventDefault();
      setSubmitting(true);
      const idToken = window.gapi.auth2.getAuthInstance().currentUser.get()
        .getAuthResponse().id_token;
      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: { authorization: idToken },
      });

      const url = image ? await handleImageUpload() : null;
      const { latitude, longitude } = state.draft;
      const variables = { title, image: url, content, latitude, longitude };
      const { createPin } = await client.request(CREATE_PIN_MUTATION, variables);
      console.log("Pin created", { createPin });
      handleDeleteDraft();
    } catch(err) {
      console.log("Error creating pin", err);
    } finally {
      setSubmitting(false);
    }
  }

  const handleDeleteDraft = event => {
    setTitle("");
    setImage("");
    setContent("");

    dispatch({ type: "DELETE_DRAFT" });
  }

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge} /> Pin Location
      </Typography>
      <div>
        <TextField
          onChange={e => setTitle(e.target.value) }
          name="title"
          label="Title"
          placeholder="Insert pin title"
        />
        <input className={classes.input} id="image" type="file" accept="image/*"
          onChange={e => setImage(e.target.files[0]) } />
        <label htmlFor="image">
          <Button
            className={classes.button}
            style={{ color: image && "green" }}
            component="span"
            size="small"
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          onChange={e => setContent(e.target.value) }
          name="content"
          label="Content"
          rows="6"
          margin="normal"
          variant="outlined"
          multiline
          fullWidth
        />
      </div>
      <div>
        <Button
          onClick={handleDeleteDraft}
          className={classes.button}
          variant="contained"
          color="primary"
         >
          <ClearIcon className={classes.leftIcon} /> Discard
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!title.trim() || !content.trim() || submitting }
          className={classes.button}
          variant="contained"
          color="secondary"
         >
          Submit
          <SaveIcon className={classes.rightIcon} />
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
