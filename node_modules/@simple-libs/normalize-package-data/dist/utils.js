export function isEmail(value) {
    return value.includes('@') && value.indexOf('@') < value.lastIndexOf('.');
}
export function hasProtocol(value) {
    return /^[a-z][a-z\d+.-]*:/i.test(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxVQUFVLE9BQU8sQ0FBQyxLQUFhO0lBQ25DLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDM0UsQ0FBQztBQUVELE1BQU0sVUFBVSxXQUFXLENBQUMsS0FBYTtJQUN2QyxPQUFPLHFCQUFxQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMxQyxDQUFDIn0=