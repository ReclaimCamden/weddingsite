import React, { useState, Component } from 'react'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'
import TextField from '@mui/material/TextField'

import Button from '@mui/material/Button'
import * as contentful from 'contentful-management'

class CommentEntry extends Component {
    constructor(props) {
        super(props)
        // Don't call this.setState() here!
        this.state = { author: '', body: '' }
    }
    // const [author, setAuthor] = useState('')
    // const [body, setBody] = useState('')
    // const client = contentful.createClient({
    //     accessToken: process.env.REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN,
    // })
    updateBody = (e) => {
        console.log('e.target', e.target.value)
        this.setState({ body: e.target.value })
    }
    updateAuthor = (e) => {
        console.log('e.target', e.target.value)
        this.setState({ author: e.target.value })
    }

    createEntry() {
        this.props.client
            .getSpace('k8mm7z31obcw')
            .then((space) =>
                space.getEnvironment(
                    process.env.REACT_APP_CONTENFUL_GENERAL_ENV
                )
            )
            .then((environment) =>
                environment.createEntry('comment', {
                    fields: {
                        body: {
                            'en-US': `${this.state.body}`,
                        },
                        author: {
                            'en-US': `${this.state.author}`,
                        },
                    },
                })
            )
            .then((entry) => {
                //entry id is under entry.sys.id
                console.log(entry)
                this.publishEntry(entry.sys.id)
            })
            .catch(console.error)
    }

    publishEntry(entryId) {
        this.props.client
            .getSpace('k8mm7z31obcw')
            .then((space) => space.getEnvironment('ifg9j4qnqxfb'))
            .then((environment) => environment.getEntry(entryId))
            .then((entry) => entry.publish())
            .then((entry) => console.log(`Entry ${entry.sys.id} published.`))
            .catch(console.error)
    }

    render() {
        return (
            <Grid container justifyContent="center">
                <Grid
                    item
                    xs={6}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        margin: '2rem',
                        padding: '2rem',
                    }}
                >
                    <Grid container justify="flex-start">
                        <Grid item xs={6}>
                            <TextField
                                id="standard-basic"
                                label="Name please"
                                variant="standard"
                                onChange={this.updateAuthor}
                            />
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="center">
                        <Grid item xs={8}>
                            <TextField
                                style={{ width: '80%' }}
                                id="standard-basic"
                                // fullWidth
                                label="Add Comment..."
                                variant="standard"
                                onChange={this.updateBody}
                            />
                        </Grid>
                        <Grid item xs={12} style={{ padding: '1rem' }}>
                            <Button
                                variant="contained"
                                onClick={this.createEntry}
                            >
                                Send Message
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default CommentEntry