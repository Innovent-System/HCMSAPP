import React, { useEffect, useRef } from 'react';
import { Query, Builder, BasicConfig, Utils as QbUtils } from '@react-awesome-query-builder/mui';
import { MuiConfig } from '@react-awesome-query-builder/mui';
import '@react-awesome-query-builder/mui/css/styles.css' //optional, for more compact styles
import PropTypes, { object } from 'prop-types'
import { useDispatch } from 'react-redux';
import { builderQueryAction } from '../store/actions/httpactions'
import { throttle, debounce } from '../util/common'
import './querybuillder.css'
// Choose your skin (ant/material/vanilla):
MuiConfig.settings.maxNesting = 1;
MuiConfig.settings.addRuleLabel = "Add Filter"
MuiConfig.settings.showNot = false;
const InitialConfig = MuiConfig; // or MaterialConfig or MuiConfig or BootstrapConfig or BasicConfig
// You need to provide your own config. See below 'Config format'
InitialConfig.operators.like.mongoFormatOp = (field, op, value) => ({ [field]: { '$regex': value, "$options": "i" } });
export const queryValue = { "id": QbUtils.uuid(), "type": "group" };
export const loadTree = QbUtils.loadTree;

export const defultValue = (treeValue = queryValue) => ({
    tree: QbUtils.sanitizeTree(QbUtils.loadTree(treeValue), InitialConfig).fixedTree,
    config: InitialConfig
})
// You can load query value from your backend storage (for saving see `Query.onChange()`)

/**
 * @param {Object} Props 
 * @param {import('@react-awesome-query-builder/mui').Fields} Props.fields
 * @param {{tree:import('@react-awesome-query-builder/mui').ImmutableTree,config:import('@react-awesome-query-builder/mui').Config}} Props.query
 * @param {(tree:import('@react-awesome-query-builder/mui').ImmutableTree,config:import('@react-awesome-query-builder/mui').Config) => {}} Props.setQuery 
 */
const QueryBuilder = ({ fields, query, setQuery, resetQuery }) => {

    const dispatch = useDispatch();

    // const [query, setQuery] = useState({
    //     tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), InitialConfig),
    //     config: InitialConfig
    // })

    const debouncedClick = useRef(debounce(onChange, 300)).current;


    useEffect(() => {
        if (fields) {
            InitialConfig.settings.maxNumberOfRules = Object.keys(fields).length;
            InitialConfig.settings.defaultMaxRows = InitialConfig.settings.maxNumberOfRules;
            const setConfig = { ...InitialConfig, fields }

            setQuery({
                tree: QbUtils.loadTree(mapToQueryBuilderFormat(fields)),
                config: setConfig
            })
        }

    }, [fields])



    const renderBuilder = (props) => (
        <div className="query-builder-container">
            {/* qb-lite */}
            <div className="query-builder" >
                <Builder {...props}  />
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
        // const jsonTree = QbUtils.getTree(immutableTree);
        // console.log(jsonTree);
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

            {/* {renderResult(query)} */}
        </div>
    )
}

// QueryBuilder.propTypes = {
//     fields: PropTypes.shape({
//         [PropTypes.string]: PropTypes.shape({
//             label: PropTypes.string,
//             type: PropTypes.oneOf(["!group", "boolean", "date", "datetime", "multiselect",
//                 "case_value", "number", "select", "text", "time"]),
//             fieldSettings: PropTypes.object,
//             valueSources: PropTypes.arrayOf(PropTypes.string),
//             preferWidgets: PropTypes.arrayOf(
//                 PropTypes.oneOf([
//                     "boolean",
//                     "case_value",
//                     "date",
//                     "datetime",
//                     "multiselect",
//                     "number",
//                     "select",
//                     "text",
//                     "time",
//                     "func",
//                     "field",
//                     "textarea",
//                     "slider",
//                     "rangeslider"
//                 ])
//             ),
//         })
//     }),
//     query: PropTypes.shape({
//         tree: PropTypes.object,
//         config: PropTypes.object
//     }),
//     setQuery: PropTypes.func
// }

export default QueryBuilder;


/**
 * 
 * @param {import('@react-awesome-query-builder/mui').Fields} _fields 
 * @returns {Object}
 */
export const mapToQueryBuilderFormat = (_fields) => {

    return {
        "id": QbUtils.uuid(),
        "type": "group",
        "children1": Object.keys(_fields).filter(c => "defaultValue" in _fields[c]).map(k => ({
            "type": "rule",
            "id": QbUtils.uuid(),
            "properties": {
                "fieldSrc": "field",
                "field": _fields[k]?.fieldName ?? _fields[k]?.label.toLocaleLowerCase(),
                "operator": _fields[k]?.defaultOperator,
                "value": [_fields[k]?.defaultValue],
                "valueType": [_fields[k].type],
                "valueSrc": ["value"]
            }

        }))
    }

}