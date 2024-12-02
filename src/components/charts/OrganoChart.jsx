import React from "react";
import Tree from "react-d3-tree";
import { useCenteredTree } from "../../hooks/useCenteredTree";
import { Card, CardHeader, CardContent, Avatar, CardActionArea, IconButton } from '../../deps/ui'
import { ExpandMore, ExpandLess } from '../../deps/ui/icons'
import Controls from "../controls/Controls";


const containerStyles = {
  width: "100vw",
  height: "100vh"
};
const data = {
  "name": "CEO",
  "children": [
    {
      "name": "Manager",
      "attributes": {
        "department": "Production"
      },
      "children": [
        {
          "name": "Foreman",
          "attributes": {
            "department": "Fabrication"
          },
          "children": [
            {
              "name": "Workers"
            }
          ]
        },
        {
          "name": "Foreman",
          "attributes": {
            "department": "Assembly"
          },
          "children": [
            {
              "name": "Workers"
            }
          ]
        }
      ]
    },
    {
      "name": "Manager",
      "attributes": {
        "department": "Marketing"
      },
      "children": [
        {
          "name": "Sales Officer",
          "attributes": {
            "department": "A"
          },
          "children": [
            {
              "name": "Salespeople"
            }
          ]
        },
        {
          "name": "Sales Officer",
          "attributes": {
            "department": "B"
          },
          "children": [
            {
              "name": "Salespeople"
            }
          ]
        }
      ]
    }
  ]
}
const getInitials = (fullName) => {
  const [firstName, lastName] = fullName.split(" ");
  return `${firstName.charAt(0)}${lastName?.charAt(0) ?? ""}`
}

// Here we're using `renderCustomNodeElement` render a component that uses
// both SVG and HTML tags side-by-side.
// This is made possible by `foreignObject`, which wraps the HTML tags to
// allow for them to be injected into the SVG namespace.
const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps
}) => (
  <g>

    {/* `foreignObject` requires width & height to be explicitly set. */}
    <foreignObject {...foreignObjectProps}>
      <Card elevation={5}>
        <CardHeader

          avatar={
            <Avatar variant="rounded" aria-label="recipe">
              {getInitials(nodeDatum.name)}
            </Avatar>
          }
          sx={{ pb: 0 }}

          title={nodeDatum.name}
          subheader={nodeDatum?.attributes?.department}
        />
        {/* <h3 style={{ textAlign: "center" }}>{nodeDatum.name}</h3> */}
        {nodeDatum.children && (
          <CardActionArea sx={{ textAlign: "center" }}>
            <IconButton size="small" onClick={toggleNode}>
              {nodeDatum.__rd3t.collapsed ? <ExpandMore fontSize="small" /> : <ExpandLess fontSize="small" />}
            </IconButton>
          </CardActionArea>

        )}
      </Card>
    </foreignObject>
  </g>
);

export default function App() {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: -100 };
  return (
    <div style={containerStyles} ref={containerRef}>
      <Tree
        data={data}
        translate={translate}
        pathFunc="step"
        separation={{ siblings: 2, nonSiblings: 2 }}
        enableLegacyTransitions={true}
        nodeSize={nodeSize}
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
        }
        orientation="vertical"
      />
    </div>
  );
}
