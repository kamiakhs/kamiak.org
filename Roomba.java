import java.awt.*;

public class Roomba extends Critter {

    private static final int IDLE_LIMIT = 15;
    private static int moves = 0;
    private int lastMoves = 0; // for tracking # of teammates
    private static int steps = 0;
    private int lastSteps; // for tracking number of steps
    private int turnsIdle = 0;
    private boolean keepDirection = false;  // whether or not to point in the same direction after reinfecting
    private static int countdown = 100;
    private static int side = 0;
    private int sideTracker = 0;  // for keeping track of side changing
    private static int countdownTracker = 0;  // for keeping track of countdown
    private static Direction NORTH = Direction.NORTH,
                             EAST  = Direction.EAST,
                             SOUTH = Direction.SOUTH,
                             WEST  = Direction.WEST;

    public Roomba() {
        super();
        lastSteps = steps;
        countdown--;
        updateCountdown();
    }

    public Action getMove(CritterInfo info) {

        if (steps != lastSteps+1) steps++;
        lastSteps = steps;

        int teammates = moves ++- lastMoves;  // Only a super rough estimate
        lastMoves = moves;

        if (countdown > 0 && teammates > 4) countdown += 4;

        if (info.getFront() == Neighbor.OTHER) {
            if (countdown > 0) countdown -= 10;
            else countdown -= 8;
            updateCountdown();
            if (keepDirection) turnsIdle = IDLE_LIMIT;
            return Action.INFECT;
        }
        if (info.getLeft() == Neighbor.OTHER) return Action.LEFT;
        if (info.getRight() == Neighbor.OTHER) return Action.RIGHT;
        if (info.getBack() == Neighbor.OTHER) return Action.RIGHT;


        if (side != sideTracker) {
            keepDirection = false;
            turnsIdle = 0;
            sideTracker = side;
        }

        if (countdown <= 0) {
            if (info.getFront() == Neighbor.WALL) {
                countdown += 2;
                if (countdown > 0) {
                    countdown = 1000;
                    side++;
                    // Swap north and south
                    Direction temp = NORTH;
                    NORTH = SOUTH;
                    SOUTH = temp;
                    // Swap east and west
                    temp = WEST;
                    WEST = EAST;
                    EAST = temp;
                }
            }

            if (!keepDirection && (info.getDirection() == SOUTH || info.getDirection() == EAST)) return Action.RIGHT;
            if (!keepDirection && (info.getDirection() == NORTH)) return Action.RIGHT;
            if ((info.getFront() == Neighbor.WALL || info.getFront() == Neighbor.SAME) && !(getWest(info) == Neighbor.SAME || getWest(info) == Neighbor.WALL)) {
                keepDirection = false;
                return Action.INFECT;
            } else {
                keepDirection = true;
                return Action.HOP;  // can't do anything
            }
        }


        if (keepDirection) {
            turnsIdle -= 5;
            if (turnsIdle > 0) {
                countdown -= 5;
                updateCountdown();
                return Action.INFECT;
            } else {
                keepDirection = false;
                if (!keepDirection && info.getDirection() == SOUTH || info.getDirection() == EAST) return Action.RIGHT;
                if (!keepDirection && info.getDirection() == NORTH) return Action.RIGHT;
            }
        }

        // If hitting east wall, go down
        if (info.getDirection() == EAST && info.getFront() == Neighbor.WALL) {
            return Action.RIGHT;
        }
        // If going along east wall, continue until south wall or a teammate is in front
        if (info.getDirection() == NORTH && info.getRight() == Neighbor.WALL && !(info.getFront() == Neighbor.WALL || info.getFront() == Neighbor.SAME)) {
            return Action.HOP;
        }
        // If can't go forward anymore and on east wall, don't do anything
        if (info.getDirection() == NORTH) {
            if (info.getRight() == Neighbor.WALL && (info.getFront() == Neighbor.WALL || info.getFront() == Neighbor.SAME)) {
                countdown -= 5;
                updateCountdown();
                if (turnsIdle++ > IDLE_LIMIT) {
                    keepDirection = true;
                    return Action.RIGHT;
                }
                return Action.INFECT;
            } else turnsIdle = 0;
        }
        // If couldn't go forward and facing away from wall, spam infect
        if (info.getDirection() == WEST && info.getBack() == Neighbor.WALL && (info.getRight() == Neighbor.WALL || info.getRight() == Neighbor.SAME)) {
            countdown -= 5;
            updateCountdown();
            return Action.INFECT;
        }

        // If facing east and hitting teammate, go down
        if (info.getDirection() == EAST && info.getFront() == Neighbor.SAME) {
            return Action.RIGHT;
        }
        // If going down because of teammates on the right, continue until north wall is in front
        if (info.getDirection() == SOUTH && info.getLeft() == Neighbor.SAME && !(info.getFront() == Neighbor.WALL || info.getFront() == Neighbor.SAME)) {
            return Action.HOP;
        }
        if (info.getDirection() == SOUTH) {
            if (info.getLeft() == Neighbor.SAME && (info.getFront() == Neighbor.WALL || info.getFront() == Neighbor.SAME)) {
                countdown -= 5;
                updateCountdown();
                if (turnsIdle++ > IDLE_LIMIT) {
                    keepDirection = true;
                    return Action.RIGHT;
                }
                return Action.INFECT;
            } else turnsIdle = 0;
        }
        if (info.getDirection() == WEST && info.getBack() == Neighbor.SAME && (info.getLeft() == Neighbor.WALL || info.getLeft() == Neighbor.SAME)) {
            countdown -= 5;
            updateCountdown();
            return Action.INFECT;
        }
        // If going down and no teammate is on the right, go right
        if (info.getDirection() == SOUTH && info.getLeft() == Neighbor.EMPTY) {
            return Action.RIGHT;
        }


        // Go to the east
        if (info.getDirection() != EAST) {
            if (info.getDirection() == WEST || info.getDirection() == NORTH) {
                return Action.RIGHT;
            }
            if (info.getDirection() == SOUTH) {
                return Action.RIGHT;
            }
        }

        return Action.HOP;

    }

    public Color getColor() {
        return new Color(90, 90, 90);
    }

    public String toString() {
        return "O";
    }

    private static void updateCountdown() {
        if (countdown <= 0 && countdownTracker > 0) {
            countdown = -100;
            side++;
        }
        countdownTracker = countdown;
    }

    public static Neighbor getWest(CritterInfo info) {
        switch (info.getDirection()) {
            case NORTH: return info.getLeft();
            case EAST: return info.getBack();
            case SOUTH: return info.getRight();
            case WEST: return info.getFront();
        }
        return null;
    }
}
