import React, { useEffect, useRef } from 'react';
import { Query, Builder, BasicConfig, Utils as QbUtils } from '@react-awesome-query-builder/mui';
import { MuiConfig } from '@react-awesome-query-builder/mui';
import '@react-awesome-query-builder/mui/css/styles.css' //optional, for more compact styles
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux';
import { builderQueryAction } from '../store/actions/httpactions'
import { throttle, debounce } from '../util/common'
// Choose your skin (ant/material/vanilla):
const InitialConfig = MuiConfig; // or MaterialConfig or MuiConfig or BootstrapConfig or BasicConfig

// You need to provide your own config. See below 'Config format'
InitialConfig.operators.like.mongoFormatOp = (field, op, value) => ({ [field]: { '$regex': value, "$options": "i" } });
export const queryValue = { "id": QbUtils.uuid(), "type": "group" };
export const loadTree = QbUtils.loadTree;

export const defultValue = () => ({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), InitialConfig),
    config: InitialConfig
})
// You can load query value from your backend storage (for saving see `Query.onChange()`)

/**
 * @param {Object} Props 
 * @param {import('@react-awesome-query-builder/mui').Fields} Props.fields
 * @param {{tree:import('@react-awesome-query-builder/mui').ImmutableTree,config:import('@react-awesome-query-builder/mui').Config}} Props.query
 * @param {(tree:import('@react-awesome-query-builder/mui').ImmutableTree,config:import('@react-awesome-query-builder/mui').Config) => {}} Props.setQuery 
 */
const QueryBuilder = ({ fields, query, setQuery }) => {

    const dispatch = useDispatch();
    
    // const [query, setQuery] = useState({
    //     tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), InitialConfig),
    //     config: InitialConfig
    // })

    const debouncedClick = useRef(debounce(onChange, 300)).current;


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

            <div>MongoDb query: <pre>{JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}</pre></div>
        </div>
    )

    function onChange(immutableTree, config) {
        // Tip: for better performance you can apply `throttle` - see `examples/demo`

        setQuery({ tree: immutableTree, config: config });
        dispatch(builderQueryAction(QbUtils.mongodbFormat(immutableTree, config)));
        const jsonTree = QbUtils.getTree(immutableTree);
        console.log(jsonTree);
        // `jsonTree` can be saved to backend, and later loaded to `queryValue`
    }

    return (
        <div>
            <Query
                {...query.config}
                value={query.tree}
                onChange={debouncedClick}
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
    }),
    query: PropTypes.shape({
        tree: PropTypes.object,
        config: PropTypes.object
    }),
    setQuery: PropTypes.func
}

export default QueryBuilder;