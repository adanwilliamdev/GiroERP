@echo off
REM ----------------------------------------------------------------------------
REM Maven Wrapper Startup Script for Windows
REM ----------------------------------------------------------------------------

setlocal

set DIR=%~dp0

set MAVEN_OPTS=%MAVEN_OPTS% -XX:+TieredCompilation -XX:TieredStopAtLevel=1

"%JAVA_HOME%\bin\java.exe" %MAVEN_OPTS% -classpath "%DIR%\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*

endlocal