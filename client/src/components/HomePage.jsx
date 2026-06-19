import PropTypes from 'prop-types';

function HomePage() {
    return(
        <h1>HomePage Last Race</h1>
    );
};

HomePage.propTypes = {
    user: PropTypes.object
};

export default HomePage;