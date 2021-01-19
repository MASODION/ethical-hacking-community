import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import Post from '../components/posts/Post';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types'; 
import PostSkeleton from '../util/PostSkeleton';

//Redux stuff
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';


//MUI stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

const styles = {
    card: {
        marginBottom: '20px'
    },
    actions: {
        display: 'flex'
    },
    expand: {
        marginLeft: 'auto'
    },
    cardContent: {
        marginTop: '-20px'
    },
    cardBottomActions: {
        marginTop: '-30px'
    },
    cover: {
        minWidth: 200,
        objectFit: 'cover'
      },
      formControl: {
        margin: 1,
        minWidth: 120,
      },
      selectEmpty: {
        marginTop: 2,
      },
};


export class home extends Component {
    state = {
        orderType: 'date_desc',
        tag: 'all',
        firstTime: true
    }
    componentDidMount(){
        this.props.getPosts(this.state.orderType, this.state.firstTime);
        this.setState({
            firstTime: false
        })
    }
    handleChange = (event) => {
        console.log(event.target.name);
        this.setState({
            [event.target.name]: event.target.value,
            firstTime: false
        });
        this.props.getPosts(event.target.value, this.state.firstTime);
      };
    render() {
        const { posts, loading} = this.props.data; 
        const { classes } = this.props;
        const { tag } = this.state;
        let recentPostsMarkup = !loading ? (
            posts.map((post) => {
                if(tag === 'all') {
                    return (<Post key={post.postId} post={post}/>);
                }
                else if(post.tags.toLowerCase().includes(tag.toLowerCase())) {
                    return (<Post key={post.postId} post={post}/>);
                }
            })
        ) : (
            <PostSkeleton/>
        );
        return (
            <Grid container spacing={2}>
                <Grid item sm={2} xs={2}>
                    <Card className={classes.card}>
                        <CardHeader title="Filters"/>
                        <CardContent className={classes.cardContent}>
                        <FormControl component="fieldset">
                            <RadioGroup aria-label="tag" name="tag" value={this.state.tag} onChange={this.handleChange}>
                                <FormControlLabel value="all" control={<Radio />} label="all" />
                                <FormControlLabel value="PHP" control={<Radio />} label="PHP" />
                                <FormControlLabel value="NodeJs" control={<Radio />} label="NodeJs" />
                                <FormControlLabel value="C++" control={<Radio />} label="C++" />
                                <FormControlLabel value="C#" control={<Radio />} label="C#" />
                                <FormControlLabel value="Java" control={<Radio />} label="Java" />
                                <FormControlLabel value="Python" control={<Radio />} label="Python" />
                            </RadioGroup>
                        </FormControl>
                        <hr/>
                        <FormControl className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Order By</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                name="orderType"
                                label="Order By"
                                value={this.state.orderType}
                                onChange={this.handleChange}
                            >
                            <MenuItem value='date_desc'>Date (desc)</MenuItem>
                            <MenuItem value='date_asc'>Date (asc)</MenuItem>
                            <MenuItem value='prize_desc'>Prize (desc)</MenuItem>
                            <MenuItem value='prize_asc'>Prize (asc)</MenuItem>
                            <MenuItem value='likes'>Likes</MenuItem>
                            </Select>
                        </FormControl>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item sm={10} xs={2}>
                    {recentPostsMarkup}
                </Grid>
            </Grid>
        )
    }
}

home.propTypes = {
    getPosts: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getPosts })(withStyles(styles)(home));
