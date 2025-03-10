module project/logging-service

go 1.23.7

require (
	github.com/sirupsen/logrus v1.9.3
	gopkg.in/natefinch/lumberjack.v2 v2.2.1
)

replace project/logging-service => github.com/DurgaPratapRajbhar/sunsolarpowers/logging-service v1.0.0

require (
	github.com/davecgh/go-spew v1.1.2-0.20180830191138-d8f796af33cc // indirect
	github.com/pmezard/go-difflib v1.0.1-0.20181226105442-5d4384ee4fb2 // indirect
	github.com/stretchr/testify v1.9.0 // indirect
	golang.org/x/sys v0.31.0 // indirect
)
