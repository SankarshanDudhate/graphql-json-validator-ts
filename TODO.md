1. Should contain all the mandatory fields
2. All the included fields must conform to the specified type
3. Allowed types must be concrete object types (not interfaces or unions)
   - Should we omit fields that are returned but not part of the specified type
   - Should we have a different error message when an allowed type given is an empty string
4. ListTypes:
   - Should be an array
   - Should not contain undefined
   - Lists with optional scalars can have null
   - Lists with mandatory scalars must be arrays where all members are of specified scalar type
   - Lists with object in them
   - Nested lists
5. Root object
   - What if it is undefined?
6. Provide extensions for errors that include the differences between actual object and all allowed types
7. Omit fields which are undefined (?)
8. Should we convert int, float, boolean into string?
9. Should allowed types contain input types?
10. Currently, we don't validate the entire schema at once. We only validate as deep as the actual data goes. If data is an empty object, schema at deeper levels won't be validated. e.g. If we have an interface type (which isn't allowed at the moment) inside an object type inside an object type, it won't be validated if the data is an empty object. We should perhaps address this in the future.

Temp:
1. Validate one object with a single level structure
2. Validate one object with multi-level structure
3. Validate multiple object with multi-level structures

Gotchas:
- undefined 
   - for scalars throws errors
- Extra fields returned should be ignored (don't throw error)
- How to deal with lists of JSON ([JSON])?
