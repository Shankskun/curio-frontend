import {
  SET_USER_ARTEFACTS,
  ADD_NEW_ARTEFACT,
  SET_SELECTED_ARTEFACT,
  UPDATE_SELECTED_ARTEFACT,
  DELETE_SELECTED_ARTEFACT
} from "../types/artefactsTypes";
import {
  createArtefactAPIRequest,
  getUserArtefactsAPIRequest,
  selectArtefactAPIRequest,
  updateSelectedArtefactAPIRequest,
  likeAPIRequest,
  unlikeAPIRequest,
  deleteSelectedArtefactAPIRequest
} from "../utils/APIHelpers/artefactAPIHelpers";

import { uploadImageToGCS } from "../utils/imageUpload";

// Async Redux actions //
// get all artefacts of user based on userId
export const getUserArtefacts = userId => dispatch => {
  // get all artefacts posted by user
  getUserArtefactsAPIRequest(userId)
    // success
    .then(res => dispatch(setUserArtefacts(res.data)))
    // failure
    .catch(err => console.log("artefactActions: " + err));
};

// like an artefact
export const likeArtefact = (artefactId, userId) => dispatch => {
  return new Promise((resolve, reject) => {
    // add like to artefact from user
    likeAPIRequest(artefactId, userId)
      // success
      .then(res => {
        dispatch(updateSelectedArtefact(res.data));
        resolve(res);
      })
      // failure
      .catch(err => {
        console.log("artefactActions: " + err);
        reject(err);
      });
  });
};

// unlike an artefact
export const unlikeArtefact = (artefactId, userId) => dispatch => {
  return new Promise((resolve, reject) => {
    // remove like to artefact from user
    unlikeAPIRequest(artefactId, userId)
      // success
      .then(res => {
        dispatch(updateSelectedArtefact(res.data));
        resolve(res);
      })
      // failure
      .catch(err => {
        console.log("artefactActions: " + err);
        reject(err);
      });
  });
};

// register user based on user details
export const createNewArtefacts = artefact => dispatch => {
  return new Promise((resolve, reject) => {
    // upload image
    uploadImageToGCS(artefact.imageURI)
      .then(imageURL => {
        // prepare the body data base on new user details
        const newArtefact = {
          ...artefact,
          imageURL,
          privacy: artefact.privacy === "Private" ? 0 : 1
        };
        // send a post API request to backend to register user
        createArtefactAPIRequest(newArtefact)
          .then(res => {
            // add the new artefact directly to redux state
            dispatch(addNewArtefact(res.data));
            resolve(res);
          })
          .catch(err => {
            console.log("Failed to create new artefact: " + err);
            reject(err);
          });
      })
      .catch(err => {
        console.log("Failed to upload image at creating new artefact: " + err);
        reject(err);
      });
  });
};

// select artefact of artefactId
export const selectArtefact = artefactId => dispatch => {
  return new Promise((resolve, reject) => {
    // get artefact based on artefactId
    selectArtefactAPIRequest(artefactId)
      .then(res => {
        // add selected artefact to redux state
        dispatch(setSelectedArtefact(res.data));
        resolve(res);
      })
      .catch(err => {
        console.log("Failed to select artefact" + err);
        reject(err);
      });
  });
};

// update selected artefact
export const editSelectedArtefact = artefact => dispatch => {
  return new Promise((resolve, reject) => {
    // upload image
    uploadImageToGCS(artefact.imageURI).then(imageURL => {
      // prepare the data for new images
      const newImages = artefact.images;
      newImages[0].URL = imageURL;

      // prepare the body data base on new user details
      const selectedArtefact = {
        ...artefact,
        images: newImages
      };

      // update artefact in the backend
      updateSelectedArtefactAPIRequest(selectedArtefact._id, selectedArtefact)
        .then(res => {
          // update selected artefact to redux state
          dispatch(updateSelectedArtefact(res.data));
          resolve(res);
        })
        .catch(err => {
          console.log("Failed to update artefact" + err);
          reject(err);
        });
    });
  });
};

// delete selected artefact
export const removeSelectedArtefact = artefactId => dispatch => {
  return new Promise((resolve, reject) => {
    deleteSelectedArtefactAPIRequest(artefactId)
      .then(res => {
        // delete selected artefact and update artefacts in redux state
        dispatch(deleteSelectedArtefact(res.data));
        resolve(res);
      })
      .catch(err => {
        console.log("Failed to delete artefact" + err);
        reject(err);
      });
  });
};

// Redux actions //
// store all of the user's artefacts into redux state
export const setUserArtefacts = decoded => {
  return {
    type: SET_USER_ARTEFACTS,
    payload: decoded
  };
};

// add user's newly posted/created rtefacts into redux state
export const addNewArtefact = decoded => {
  return {
    type: ADD_NEW_ARTEFACT,
    payload: decoded
  };
};

// assign new artefact to user
export const setSelectedArtefact = decoded => {
  return {
    type: SET_SELECTED_ARTEFACT,
    payload: decoded
  };
};

// update selected artefact
export const updateSelectedArtefact = decoded => {
  return {
    type: UPDATE_SELECTED_ARTEFACT,
    payload: decoded
  };
};

// delete selected artefact
export const deleteSelectedArtefact = decoded => {
  return {
    type: DELETE_SELECTED_ARTEFACT,
    payload: decoded
  };
};
