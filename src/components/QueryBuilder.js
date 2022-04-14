import React, { useEffect, useState } from 'react';
import { Query, Builder, BasicConfig, Utils as QbUtils } from 'react-awesome-query-builder';
import MuiConfig from 'react-awesome-query-builder/lib/config/mui';
import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-awesome-query-builder/lib/css/compact_styles.css'; //optional, for more compact styles
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux';
import { SET_QUERY, RESET_QUERY } from '../store/actions/types'
// Choose your skin (ant/material/vanilla):
const InitialConfig = MuiConfig; // or MaterialConfig or MuiConfig or BootstrapConfig or BasicConfig

// You need to provide your own config. See below 'Config format'
InitialConfig.operators.like.mongoFormatOp = (field, op, value) => ({ [field]: { '$regex': value, "$options": "i" } });


// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue = { "id": QbUtils.uuid(), "type": "group" };


const QueryBuilder = ({ fields }) => {

    const dispatch = useDispatch();
    const [query, setQuery] = useState({
        tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), InitialConfig),
        config: InitialConfig
    })

    useEffect(() => {
        if (fields) {
            const setConfig = { ...InitialConfig, fields }
            setQuery({
                tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), setConfig),
                config: setConfig
            })
        }

    }, [fields])


    const renderBuilder = (props) => (
        <div className="query-builder-container">
            <div className="query-builder qb-lite">
                <Builder {...props} />
            </div>
        </div>
    )

    const renderResult = ({ tree: immutableTree, config }) => (
        <div className="query-builder-result">
            {console.log(QbUtils)}
            <div>MongoDb query: <pre>{JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}</pre></div>
        </div>
    )

    const onChange = (immutableTree, config) => {
        // Tip: for better performance you can apply `throttle` - see `examples/demo`
        setQuery({ tree: immutableTree, config: config });

        dispatch({ type: SET_QUERY, payload: { builder: JSON.stringify(QbUtils.mongodbFormat(immutableTree, config)) } });
        const jsonTree = QbUtils.getTree(immutableTree);
        console.log(jsonTree);
        // `jsonTree` can be saved to backend, and later loaded to `queryValue`
    }

    return (
        <div>
            <Query
                {...query.config}
                value={query.tree}
                onChange={onChange}
                renderBuilder={renderBuilder}
            />
            {renderResult(query)}
        </div>
    )
}

QueryBuilder.propTypes = {
    fields: PropTypes.shape({
        [PropTypes.string]: PropTypes.shape({
            label: PropTypes.string,
            type: PropTypes.oneOf(["!group", "boolean", "date", "datetime", "multiselect",
                "case_value", "number", "select", "text", "time"]),
            fieldSettings: PropTypes.object,
            valueSources: PropTypes.arrayOf(PropTypes.string),
            preferWidgets: PropTypes.arrayOf(
                PropTypes.oneOf([
                    "boolean",
                    "case_value",
                    "date",
                    "datetime",
                    "multiselect",
                    "number",
                    "select",
                    "text",
                    "time",
                    "func",
                    "field",
                    "textarea",
                    "slider",
                    "rangeslider"
                ])
            ),
        })
    }).isRequired
}

export default QueryBuilder;