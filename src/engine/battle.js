export default function GetTurnOrder(creatures) {
    return [...creatures].sort((a, b) => b.speed - a.speed);
}