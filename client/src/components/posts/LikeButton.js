import React, { Component } from 'react';
import MyButton from '../../util/MyButton';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
// REdux
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../../redux/actions/dataActions';
import { editUserDetails } from '../../redux/actions/userActions';

//MUI stuff
import Badge from '@material-ui/core/Badge';


export class LikeButton extends Component {
    likedPost = () => {
        if(this.props.user.likes && this.props.user.likes.find(like => like.postId === this.props.postId)) 
            return true;
        else
            return false;
    };
    likePost = () => {
        this.props.likePost(this.props.postId);
        this.props.user.credentials.likesCount++;
        const userData = {
            likesCount: this.props.user.credentials.likesCount
        };
        this.props.editUserDetails(userData);
    };
    unlikePost = () => {
        this.props.unlikePost(this.props.postId);
        this.props.user.credentials.likesCount--;
        if(this.props.user.credentials.likesCount <= 0) {
            this.props.user.credentials.likesCount = 0;
        }
        const userData = {
            likesCount: this.props.user.credentials.likesCount
        };
        this.props.editUserDetails(userData);
    };
    render() {
        const { 
            authentificated
        } = this.props.user;
        const likeButton = !authentificated ? (
            <MyButton tip="Like" disabled={this.props.disabled}>
                <Link to="/login">
                <Badge badgeContent={this.props.likeCount} color="primary">
                        <FavoriteBorder color="primary"/>
                    </Badge>
                </Link>
            </MyButton>
        ) : (
            this.likedPost() ? (
                <MyButton tip="Unlike" onClick={this.unlikePost} disabled={this.props.disabled}>
                    <Badge badgeContent={this.props.likeCount} color="primary">
                    <FavoriteIcon color="error"/>
                    </Badge>
                </MyButton>
            ) : (
                <MyButton tip="Like" onClick={this.likePost} disabled={this.props.disabled}>
                    <Badge badgeContent={this.props.likeCount} color="primary">
                        <FavoriteBorder color="primary"/>
                    </Badge>
                </MyButton>
            )
        );
        return likeButton;
    }
}

LikeButton.propTypes = {
    user: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    likePost: PropTypes.func.isRequired,
    unlikePost: PropTypes.func.isRequired,
    editUserDetails: PropTypes.func.isRequired,
    likeCount: PropTypes.number.isRequired,
    disabled: PropTypes.string
  };
  
  const mapStateToProps = (state) => ({
    user: state.user
  });
  
  const mapActionsToProps = {
    likePost,
    unlikePost,
    editUserDetails
  };
  
  export default connect(
    mapStateToProps,
    mapActionsToProps
  )(LikeButton);
