import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '../../../deps/ui'
import { FileCopy, SaveTwoTone } from '../../../deps/ui/icons'


const Weeks = [{ icon: <SaveTwoTone />, name: "Sunday", },
{ icon: <SaveTwoTone />, name: "Monday" },
{ icon: <SaveTwoTone />, name: "Tuesday" },
{ icon: <SaveTwoTone />, name: "Wednesday" },
{ icon: <SaveTwoTone />, name: "Thursday" },
{ icon: <SaveTwoTone />, name: "Friday" },
{ icon: <SaveTwoTone />, name: "Saturday" }
];

export default function OpenIconSpeedDial({ weekName, handleCopy, isHidden = true }) {
    return (
        <SpeedDial
            hidden={isHidden}
            ariaLabel="SpeedDial openIcon example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon icon={<FileCopy />} />}
        >
            {Weeks.filter(c => c.name !== weekName).map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    onClick={handleCopy}
                    tooltipOpen
                    tooltipTitle={action.name}
                />
            ))}
        </SpeedDial>
    );
}