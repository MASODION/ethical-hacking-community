import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'; 
import ResponseSkeleton from '../util/ResponseSkeleton';
import Response from '../components/responses/Response';
import PostDetails from '../components/posts/PostDetails';
import PostDetailsSkeleton from '../util/PostDetailsSkeleton';

//Redux stuff
import { connect } from 'react-redux';
import { getPostData } from '../redux/actions/dataActions';


//MUI stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const styles = {
    card: {
        marginBottom: 0
    },
    cardContent: {
        marginBottom: '-20px'
    },
    expand: {
        marginLeft: 'auto'
    },
};


export class seepost extends Component {
    state = {
        postIdParam: null
    };
    componentDidMount(){
        const postId = this.props.match.params.postId;
        this.setState({
            postIdParam: postId
        });
        this.props.getPostData(postId);
    }
    render() {
        const { loading, responses, postData } = this.props.data;
        const { classes } = this.props;
        const postMarkup = !loading && this.props.data ? (
            <PostDetails post={postData}/>
        ) : (
            <PostDetailsSkeleton />
        )
        const responsesMarkup = !loading && this.props.data ? (
            responses.map((response) => {
                return this.state.postIdParam === response.postId && response.root === this.state.postIdParam ? (
                    <Response key={response.responseId} response={response} responseIdParam={response.responseId}/>
                ) : null;
            })
        ) : (
            <ResponseSkeleton />
        )
        return (
            <Grid container spacing={2}>
                <Grid item sm={12} xs={2}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            {postMarkup}
                            {responsesMarkup}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

seepost.propTypes = {
    getPostData: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getPostData })(withStyles(styles)(seepost));