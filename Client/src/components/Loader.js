import React from 'react'

function Loader() {
    return (
        <div>
            <div className="d-flex justify-content-center">
                <div className="spinner-border">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    )
}

export default Loader
