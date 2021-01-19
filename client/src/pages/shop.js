import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ShopImg from '../images/shop.png';


//redux
import { connect } from 'react-redux';
import { getAllShopItems } from '../redux/actions/dataActions';


//mui stuff
import { makeStyles, withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import ListSubheader from '@material-ui/core/ListSubheader';
import Paper from '@material-ui/core/Paper';

//icons
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';


const styles = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
      },
      gridList: {
        width: '60%',
        height: 450,
      },
      icon: {
        color: 'rgba(255, 255, 255, 0.54)',
      },
}

export class shop extends Component {
    componentDidMount() {
        this.props.getAllShopItems();
    }
    render() {
        const { 
            loading,
            classes
        } = this.props;
        const {
            shoplist
        } = this.props.data;
        const listMarkup = !loading && shoplist && shoplist.length >= 0 ? (
            shoplist.map((item) => (
                <GridListTile key={item.itemId}>
                    <img src={ShopImg} alt={item.item} />
                  <GridListTileBar
                    title={item.item}
                    subtitle={<span>{item.description}</span>}
                    actionIcon={
                      <IconButton aria-label={`info about ${item.item}`} className={classes.icon}>
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </GridListTile>
              ))
        ) : (<p>loading ...</p>);
        return (
                <Paper className={classes.root}>
      <GridList cellHeight={180} className={classes.gridList}>
        <GridListTile key="Subheader" cols={2} style={{ height: 'auto' }}>
        </GridListTile>
        {listMarkup}
      </GridList>
      </Paper>
        )
    }
}

shop.propTypes = {
    classes: PropTypes.object.isRequired,
    getAllShopItems: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    data: state.data
})

export default connect(mapStateToProps, { getAllShopItems })(withStyles(styles)(shop))
