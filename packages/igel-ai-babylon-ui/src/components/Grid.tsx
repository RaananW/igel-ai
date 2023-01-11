import { Engines } from "./engines/Engines";
import classes from "./Grid.module.css";
import { ImageList } from "./ImageList";
import { Main } from "./Main/Main";

export function Grid() {
    return (
        <div className={classes.gridContainer}>
            <div className={classes.gridItem}>
                <Engines></Engines>
            </div>
            <div className={classes.gridItem}>
                <Main></Main>
            </div>
            <div className={classes.gridItem}><ImageList></ImageList></div>
        </div>
    );
}
