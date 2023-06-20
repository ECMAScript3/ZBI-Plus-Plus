# ZBI++
 A better scripting language for printers supporting the Zebra Basic Interpreter

## Notes
- File Extension:	.zbp
- Adds Functions
- 
- Flow Structure
	- init
	- loop
	- final

## Implementation

#### Types
- Numbers
	- var_name
- String Type
	- var_name$
	- Literal enclosed in ""
- Context
	- $var_name
	- #var_name
- Functions
	- ^Func_name ($var_1, #var_2)
- Byte buffers
	- var_name#
	- Literal enclosed in <>
- Arrays
	- @var_name
	- @var_name$
	- @var_name#
	- Literal enclosed in []

#### Functions
Functions are converted to SUB & RETURN, and function calls are converted to GOSUB. Arguments are turned into unique variables, which are given values before GOSUB is called

#### While/Until Loops
DO [ WHILE/UNTIL ] ... LOOP [ WHILE/UNTIL ] is converted to [ while/until ] { ... } [ while/until ]

#### For Loops
FOR I = A TO B [ STEP C ] ... NEXT I is converted to for (I = A, B, C) { ... }

#### Break
EXIT DO and EXIT FOR become break

#### IF
IF ... END IF is replaced by IF {}
