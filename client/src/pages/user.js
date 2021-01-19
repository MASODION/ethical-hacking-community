import React, { Component } from 'react'
import axios from 'axios';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import ProfileSkeleton from '../util/ProfileSkeleton';
import User from '../components/profile/User';
import PostEnum from '../components/profile/PostEnum';
import ResponseEnum from '../components/profile/ResponseEnum';



//MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';


const styles = {
    card: {
        marginBottom: 0,
        position: 'relative',
        display: 'flex',
    },
    cardContent: {
        marginBottom: 0,
        objectFit: 'cover',
        padding: 10,
    },
    expand: {
        marginLeft: 'auto'
    },
    paper: {
        padding: 15,
        minWidth: '100%'
    },
    menulist: {
        minWidth: '100%'
    }
};


export class user extends Component {
    state = {
        profile: null,
        posts: [],
        responses: [],
        errors: {},
        show: 'profile',
        loading: true
    }
    componentDidMount() {
        axios.get(`/user/${this.props.match.params.userNickName}`)
            .then((res) => {
                this.setState({
                    profile: res.data.profile,
                    posts: res.data.posts,
                    responses: res.data.responses,
                    loading: false
                });
            })
            .catch((err) => {
                this.setState({
                    errors: err.response.data,
                    loading: false
                })
            })
    }
    openProfileMenu = () => {
        this.setState({
            show: 'profile'
        });
    }
    openPostsMenu = () => {
        this.setState({
            show: 'posts'
        });
    }
    openResponsesMenu = () => {
        this.setState({
            show: 'responses'
        });
    }
    render() {
        const { loading, show, profile, posts, responses, errors } = this.state;
        const { classes } = this.props;
        const responsesMap = !loading && !errors.error ? (
            responses.map((response) => (
                <ResponseEnum key={response.responseId} profileData={profile} responseData={response}/>
            ))
        ) : null;
        const postsMap = !loading && !errors.error ? (
            posts.map((post) => (
                <PostEnum profileData={profile} key={post.postId} post={post}/>
            ))
        ) : null;
        const profilePage = !loading && !errors.error ? (
                show === 'profile' ? (
                    <User profileData={profile}/>
                ) : (show === 'posts' ? (
                    posts.length > 0 ? (
                        <Paper className={classes.paper}>
                            {postsMap}
                        </Paper>
                    ) : (
                        <Paper className={classes.paper}>
                            <Typography>
                                User doesn't have any posts.
                            </Typography>
                        </Paper>
                    )
                ) : (show === 'responses' ? (
                    responses.length > 0 ? (
                        <Paper className={classes.paper}>
                        {responsesMap}
                        </Paper>
                    ) : (
                        <Paper className={classes.paper}>
                            <Typography>
                                User doesn't have any responses.
                            </Typography>
                        </Paper>
                    )
                ) : (
                    <User profileData={profile}/>
                )))
        ) : (errors.error ? (
            <Paper className={classes.paper}>
                <Typography>
                    User not found.
                </Typography>
            </Paper>
        ) : (
            <ProfileSkeleton/>
        ));
        return (
            <Grid container spacing={8}>
                <Grid item sm={4} xs={2}>
                            <Paper className={classes.paper}>
                                <MenuList className={classes.menulist}>
                                    <MenuItem onClick={this.openProfileMenu}>Profile</MenuItem>
                                    <MenuItem onClick={this.openPostsMenu}>Posts</MenuItem>
                                    <MenuItem onClick={this.openResponsesMenu}>Responses</MenuItem>
                                </MenuList>
                            </Paper>
                </Grid>
                <Grid item sm={8} xs={2}>
                    {profilePage}
                </Grid>
            </Grid>
        )
    }
}

user.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(user)
